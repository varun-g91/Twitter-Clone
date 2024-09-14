import User from "../models/user.model.js";
import errorHandler from "../middleware/errorHandler.js";
import Notification from "../models/notification.model.js";
import { validatePassword } from "../middleware/validatiors.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
    const { userName } = req.params;

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
        errorHandler(error, res);
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