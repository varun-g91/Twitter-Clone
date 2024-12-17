import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { validatePassword } from "../middleware/validatiors.js";
import { generateUsername, generateFromEmail } from "unique-username-generator";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

export const getUserProfile = async (req, res) => {
    const { userName } = req.params;
    console.log("Request URL:", req.originalUrl);
    console.log("Request Params:", req.params);

    try {
        const user = await User.findOne({ userName }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(`error in getUserProfile controller: ${error.message}`);
        errorHandler(error, res);
    }
}

export const updateUserProfileImage = async (req, res) => {
    try {
        const { identifier } = req.params;

        // Check if a file was uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Get the uploaded file
        const profileImage = req.files.profileImage;

        // Find the user
        const user = await User.findOne({
            $or: [{ email: identifier }, { userName: identifier }],
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Cloudinary config
        cloudinary.config({
            cloud_name: process.env.ClOUDINARY_CLOUD_NAME,
            api_key: process.env.ClOUDINARY_API_KEY,
            api_secret: process.env.ClOUDINARY_API_SECRET
        });

        // Upload the image to Cloudinary
        const uploadedResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, {
            folder: 'profile_images',
            resource_type: 'image',
        });

        // Update the user's profile image
        user.profileImage = uploadedResponse.secure_url;
        await user.save();

        res.status(200).json({
            message: 'Profile picture updated successfully',
            profileImage: user.profileImage
        });
    } catch (error) {
        console.error(`Error in updateUserProfileImage controller:`, error);
        res.status(500).json({ error: error.message });
    }
};
export const getUsernameSuggestions = async (req, res) => {
    try {
        const { identifier, name } = req.body;

        if (!identifier && !name) {
            return res.status(400).json({ error: "Identifier or name must be provided." });
        }

        let baseUsernames = [];

        if (identifier && identifier.includes("@")) {
            // Extract username from email
            const emailBase = identifier.split("@")[0].toLowerCase();
            if (name) {
                // Combine sanitized name and email username
                const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
                baseUsernames = [
                    sanitizedName,
                    emailBase,
                    `${sanitizedName}_${emailBase}`,
                ];
            } else {
                baseUsernames = [emailBase];
            }
        } else if (name) {
            // Use sanitized name as the base username
            const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
            baseUsernames = [sanitizedName];
        } else {
            return res.status(400).json({ error: "Invalid identifier or name provided." });
        }

        // Generate variations with numbers and special characters
        const specialCharacters = ["_", "-", ".", ""];
        const numbers = Array.from({ length: 10 }, (_, i) => i.toString());
        const variations = [];

        baseUsernames.forEach((base) => {
            variations.push(base); // Original
            for (let i = 0; i < 3; i++) {
                variations.push(
                    `${base}${numbers[Math.floor(Math.random() * numbers.length)]}`,
                    `${base}${specialCharacters[Math.floor(Math.random() * specialCharacters.length)]}`,
                    `${base}${specialCharacters[Math.floor(Math.random() * specialCharacters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`
                );
            }
        });

        const suggestions = new Set();

        // Generate unique suggestions until we have at least 5
        while (suggestions.size < 5 && variations.length) {
            const randomVariation = variations[Math.floor(Math.random() * variations.length)];
            suggestions.add(randomVariation);
        }

        // Validate uniqueness against the database
        const validSuggestions = [];
        for (const suggestion of suggestions) {
            const isTaken = await User.exists({ userName: suggestion });
            if (!isTaken) {
                validSuggestions.push(suggestion);
            }
        }

        // Fallback suggestions if all initial suggestions are taken
        if (validSuggestions.length === 0) {
            for (let i = 0; i < 5; i++) {
                const fallback = `${baseUsernames[0]}${Math.floor(Math.random() * 10000)}`;
                const isTaken = await User.exists({ userName: fallback });
                if (!isTaken) {
                    validSuggestions.push(fallback);
                }
            }
        }

        if (validSuggestions.length === 0) {
            return res.status(500).json({ error: "Could not generate available usernames. Please try a different identifier or name." });
        }

        return res.status(200).json({ suggestions: validSuggestions });
    } catch (error) {
        console.error("Error generating username suggestions:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const setUsername = async (req, res) => {
    const { userName, identifier } = req.body;

    try {
        // Validate input
        if (!userName || userName.trim() === "") {
            return res.status(400).json({ message: "Username is required." });
        }

        // Check for username length (e.g., minimum 3 characters)
        if (userName.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters long." });
        }

        // Check for special characters        

        // Check if the username is already taken
        const existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            return res.status(400).json({ message: "Username is already taken." });
        }

        // Find and update the user atomically
        const updatedUser = await User.findOneAndUpdate(
            { $or: [{ email: identifier }, { phone: identifier }], isVerified: true },
            { userName },
            { new: true } // Returns the updated document
        );

        // Handle case where user is not found or not verified
        if (!updatedUser) {
            return res.status(400).json({ message: "User not found or not verified." });
        }

        // Return success response
        return res.status(200).json({ message: "Username updated successfully.", user: updatedUser });

    } catch (error) {
        console.error(`Error in setUsername controller: ${error.message}`);
        errorHandler(error, res);
    }
};
export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: 'You cannot follow or unfollow yourself' });
        }

        if (!userToModify || !currentUser) {    
            return res.status(404).json({ error: 'User not found' });
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing) {
            //Unfollow user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id }});

            //TODO: return the id of the user as a response
            res.status(200).json({ message: 'Unfollowed successfully' });
        } else {
            //Follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id }});              
            //send notification to user   

            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            });

            await newNotification.save();

            //TODO: return the id of the user as a response
            res.status(200).json({ message: 'User followed successfully' });
        }
    } catch (error) {
        console.log(`error in followUnfollowUser controller: ${error.message}`);
        next(error);
    }
}
export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByUser = await User.findById(userId).select('following');

        const users = await User.aggregate([
            {
                $match: {
                    _id: {$ne: userId},
                },
            },
            {$sample: {size: 10}}
        ]);

        const filteredUsers = users.filter(user => !usersFollowedByUser.following.includes(user._id)); 
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach(user => user.password = null);
        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log(`error in getSuggestedUsers controller: ${error.message}`);
        errorHandler(error, res);
    }
}
export const updateUser = async (req, res) => {
    const { fullName, email, userName, currentPassword, newPassword, bio, link } = req.body;
    let { profileImage, coverImage } = req.body;
    const userId  = req.user._id;
    
    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: 'Please provide both current and new password' });
        }

        if (currentPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Invalid current password' });
            }
            
            validatePassword(newPassword);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;   
        }

        if (profileImage) {
            if (user.profileImage) {
                await cloudinary.uploader.destroy(user.profileImage.split('/').pop().split('.')[0]);

            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImage);
            profileImage = uploadedResponse.secure_url;
        }

        if (coverImage) {
            if (user.coverImage) {
                await cloudinary.uploader.destroy(user.coverImage.split('/').pop().split('.')[0]);

            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImage);
            coverImage = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.userName = userName || user.userName;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImage = profileImage || user.profileImage;
        user.coverImage = coverImage || user.coverImage;

        await user.save();

        user.password = null;

        return res.status(200).json({ message: 'User updated successfully', data: user });
        
    } catch (error) {
        console.log(`error in updateUser controller: ${error.message}`);
        errorHandler(error, res);
    }
}