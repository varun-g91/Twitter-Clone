import { 
    createUser, 
    findUserByEmailOrPhone, 
} from '../services/userService.js';
import sendEmail from '../services/emailService.js';
import { v4 as uuidv4 } from 'uuid';
import sendVerificationSMS from '../services/smsService.js';
import { validateFullName, validateDateOfBirth, validateEmailOrPhone, validatePassword, validateVerificationCode } from '../middleware/validatiors.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import errorHandler from '../middleware/errorHandler.js';
import generateVerificationCode from "../utils/generateVerificationCode.js";
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import Redis from 'redis'; 

// Initialize Redis client
const redisClient = Redis.createClient({
    url: 'redis://127.0.0.1:6379'
});

// Handle Redis connection errors
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis
await redisClient.connect();

// Updated signup controller
export const signup = async (req, res) => {
    try {
        const { fullName, identifier, dateOfBirth } = req.body;

        validateFullName(fullName);
        validateEmailOrPhone(identifier);

        const parsedDateOfBirth = new Date(dateOfBirth);
        if (isNaN(parsedDateOfBirth.getTime())) {
            throw new AppError('Invalid date of birth');
        }
        validateDateOfBirth(parsedDateOfBirth);

        const existingUser = await findUserByEmailOrPhone(identifier);
        if (existingUser) {
            throw new AppError(`User with this ${identifier.includes('@') ? 'email' : 'phone'} already exists`);
        }

        const verificationCode = generateVerificationCode();
        const verificationToken = uuidv4(); // Temporary token for verification
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

        // Store the data temporarily in Redis (use 'EX' to set the expiry time in seconds)
        await redisClient.set(
            verificationToken, // Key is the token
            JSON.stringify({
                fullName,
                identifier,
                dateOfBirth: parsedDateOfBirth,
                verificationCode,
                verificationCodeExpires,
            }),
            { EX: 600 } // Expiry time set to 600 seconds (10 minutes)
        );

        if (identifier.startsWith('+')) {
            await sendVerificationSMS(identifier, verificationCode);
        } else if (identifier.includes('@')) {
            await sendEmail(identifier, verificationCode);
        }

        res.status(201).json({
            message: `User registered successfully. Please verify your ${identifier.includes('@') ? 'email' : 'phone'} to complete sign up`,
            verificationToken,
        });
    } catch (error) {
        console.log(`error in signup controller: ${error.message}`);
        errorHandler(error, res);
    }
};

export const verifySignup = async (req, res) => {
    try {
        const { identifier, verificationCode, verificationToken } = req.body;

        validateEmailOrPhone(identifier);

        // Retrieve user data from Redis using the token
        const userData = await redisClient.get(verificationToken);
        if (!userData) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        const parsedUserData = JSON.parse(userData);

        // Check if the verification code matches and has not expired
        const isVerificationCodeValid = validateVerificationCode(parsedUserData.verificationCode, verificationCode, parsedUserData.verificationCodeExpires);
        if (!isVerificationCodeValid) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

        console.log({
            fullName: parsedUserData.fullName,
            email: parsedUserData.identifier,
            dateOfBirth: new Date(parsedUserData.dateOfBirth),
            isVerified: true,
        });


        // Save the user to the database after successful verification
        const newUser = await createUser({
            fullName: parsedUserData.fullName,
            ...(identifier.includes('@') && { email: parsedUserData.identifier }),
            ...(identifier.startsWith('+') && { phone: parsedUserData.identifier }),
            dateOfBirth: new Date(parsedUserData.dateOfBirth),
            isVerified: true,
        });

        res.status(200).json({ message: 'User verified successfully. Please login', user: newUser });
    } catch (error) {
        console.log(`error in verifySignup controller: ${error.message}`);
        errorHandler(error, res);
    }
};

export const resendVerificationCode = async (req, res) => {
    try {
        const { identifier } = req.body;

        // Validate the identifier (email/phone)
        validateEmailOrPhone(identifier);

        // Find the user by email or phone
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified.' });
        }

        // Generate a new verification code
        const newVerificationCode = generateVerificationCode();
        const newVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Update the user with the new code and expiration
        user.verificationCode = newVerificationCode;
        user.verificationCodeExpires = newVerificationCodeExpires;
        await user.save();

        // Resend the verification code via the appropriate channel
        if (user.phone) {
            await sendVerificationSMS(user.phone, newVerificationCode);
        } else if (user.email) {
            await sendEmail(user.email, newVerificationCode);
        }

        res.status(200).json({ message: 'Verification code resent successfully.' });

    } catch (error) {
        console.error(`error in resendVerificationCode controller: ${error.message}`);
        errorHandler(error, res);
    }
};

export const setPassword = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        console.log(identifier, password);

        // Validate the identifier (email/phone)
        validateEmailOrPhone(identifier);

        // Find the user by email or phone
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'User has not been verified.' });
        }

        // Validate the new password
        validatePassword(password);

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user with the new password
        await user.save();

        res.status(200).json({ message: 'Password has been set successfully.' });

    } catch (error) {
        console.error(`error in setPassword controller: ${error.message}`);
        errorHandler(error, res);
    }
};


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
        console.error('error at login controller:', error.message);
        errorHandler(error, res);
    }

}
export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
        console.error(`error in logout controller: ${error.message}`);
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

