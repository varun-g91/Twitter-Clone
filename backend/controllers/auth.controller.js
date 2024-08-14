import bcrypt from "bcryptjs";
import { errorHandler } from "../middleware/errorHandler.js";
import { validateEmail, validateLogin, validatePassword, validateUsername } from "../validation/validatiors.js";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, userName, email, password, confirmPassword } = req.body;

        //validate credentials
        validateUsername(userName);
        validateEmail(email);
        validatePassword(password);

        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            throw new Error(`User ${existingUserEmail} already exists`);
        }

        const existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            throw new Error(`Username ${existingUserName} already exists`);
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            userName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImage: newUser.profileImage,
                coverImage: newUser.coverImage,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.log(`error in signup controller: ${error.message}`);
        errorHandler();
    }
}
export const login = async (req, res) => {

    try {
        const { identifier, password } = req.body;

        // Validate the login input
        validateLogin(identifier, password);

        // Find the user by either email or username
        const user = await User.findOne({
            $or: [{ email: identifier }, { userName: identifier }],
        });

        // Handle case where user is not found
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'User not found' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user?.password || '');
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', message: 'Invalid password' });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
        });

    } catch (error) {
        console.error('Error at login controller:', error.message);
        errorHandler(error, res);
    }

}
export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
        console.log(`error in logout controller: ${error.message}`);
        errorHandler(error, res);
    }
}

export const getAuthenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.log(`error in getAuthenticatedUser controller: ${error.message}`);
        errorHandler(error, res);
    }
}