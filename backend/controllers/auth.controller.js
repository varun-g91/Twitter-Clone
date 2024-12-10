import {
    createUser,
    findUserByEmailOrPhone,
} from '../services/userService.js';
import sendEmail from '../services/emailService.js';
import { v4 as uuidv4 } from 'uuid';
import sendVerificationSMS from '../services/smsService.js';
import { validateFullName, validateDateOfBirth, validateEmailOrPhone, validateLogin, validatePassword, validateVerificationCode } from '../middleware/validatiors.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import errorHandler from '../middleware/globalErrorHandler.js';
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
export const signup = async (req, res, next) => {
    try {
        const { fullName, identifier, dateOfBirth } = req.body;

        validateFullName(fullName);
        validateEmailOrPhone(identifier);

        const parsedDateOfBirth = new Date(dateOfBirth);
        if (isNaN(parsedDateOfBirth.getTime())) {
            throw new AppError('Invalid date of birth');
        }
        validateDateOfBirth(parsedDateOfBirth, next);

        const existingUser = await findUserByEmailOrPhone(identifier);
        if (existingUser) {
            return next(new AppError('User with this email already exists', 400));
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
            { EX: 600 } 
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
        // errorHandler(error, res);
        next(error);
    }
};

export const verifySignup = async (req, res, next) => {
    try {
        const { verificationToken } = req.body;

        if (!verificationToken) {
            return res.status(400).json({ message: 'Verification token is required.' });
        }

        // Retrieve user data from Redis using the token
        const userData = await redisClient.get(verificationToken);
        if (!userData) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        const parsedUserData = JSON.parse(userData);

        // Validate the verification code
        try {
            validateVerificationCode(
                parsedUserData.verificationCode,
                req.body.verificationCode, // The client still needs to send the entered code for comparison
                parsedUserData.verificationCodeExpires,
            );
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            throw error; // Re-throw if it's not an AppError
        }

        // Save the user to the database after successful verification
        const newUser = await createUser({
            fullName: parsedUserData.fullName,
            ...(parsedUserData.identifier.includes('@') && { email: parsedUserData.identifier }),
            ...(parsedUserData.identifier.startsWith('+') && { phone: parsedUserData.identifier }),
            dateOfBirth: new Date(parsedUserData.dateOfBirth),
            isVerified: true,
        });

        // Cleanup: Remove the token from Redis after successful verification
        await redisClient.del(verificationToken);

        res.status(200).json({ message: 'User verified successfully. Please login', user: newUser });
    } catch (error) {
        console.log(`error in verifySignup controller: ${error.message}`);
        // errorHandler(error, res);
        next(error);
    }
};


// Function to resend the verification code
export const resendVerificationCode = async (req, res, next) => {
    try {
        console.log('Called resendVerificationCode controller. Request body:', req.body);
        const { verificationToken } = req.body;

        // Retrieve user data from Redis using the token
        const userData = await redisClient.get(verificationToken);
        if (!userData) {
            return res.status(404).json({ message: 'User data not found in Redis. Verification token may have expired.' });
        }

        // Parse the user data from Redis
        const parsedUserData = JSON.parse(userData);

        // Generate new verification code
        const newVerificationCode = generateVerificationCode();
        const newVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // Code expires in 10 minutes

        // Update Redis cache with new verification code and expiration
        parsedUserData.verificationCode = newVerificationCode;
        parsedUserData.verificationCodeExpires = newVerificationCodeExpires;

        // Save updated data back to Redis
        await redisClient.set(verificationToken, JSON.stringify(parsedUserData), 'EX', 10 * 60); // 10 min expiry

        // Send verification code via SMS or email
        if (parsedUserData.identifier.startsWith('+')) {
            await sendVerificationSMS(parsedUserData.identifier, newVerificationCode);
        } else {
            await sendEmail(parsedUserData.identifier, newVerificationCode);
        }

        // Send success response
        return res.status(200).json({ message: 'Verification code resent successfully.' });
    } catch (error) {
        console.error(`Error in resendVerificationCode controller: ${error.message}`);
        next(error);
    }
};


export const setPassword = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;

        // Validate the identifier (email/phone)
        validateEmailOrPhone(identifier);

        // Find the user by email or phone
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!user) {
            return next(new AppError('User not found.', 400));
        }

        if (!user.isVerified) {
            return next(new AppError('User has not been verified.', 400));
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
        next(error);
    }
};


export const login = async (req, res, next) => {
    try {
        const { identifier, password, step } = req.body;

        // Declare user outside the switch block
        let user;
        const stepNumber = Number(step);

        switch (stepNumber) {
            case 1:
                // Find the user by either email, username, or phone
                user = await User.findOne({
                    $or: [{ email: identifier }, { userName: identifier }, { phone: identifier }],
                });

                if (!user) {
                    return res.status(404).json({ status: 'error', message: 'User not found' });
                }

                // Respond with success to proceed to Step 2
                return res.status(200).json({
                    status: 'success',
                    message: 'User found',
                    identifier: identifier,
                });

            case 2:
                // Ensure both identifier and password are provided
                if (!identifier || !password) {
                    return res
                        .status(400)
                        .json({ status: 'error', message: 'Identifier and password are required' });
                }

                // Find the user again
                user = await User.findOne({
                    $or: [{ email: identifier }, { userName: identifier }, { phone: identifier }],
                });

                if (!user) {
                    return res.status(404).json({ status: 'error', message: 'User not found' });
                }

                // Check if the password is correct
                const isPasswordValid = await bcrypt.compare(password, user.password || '');
                if (!isPasswordValid) {
                    console.log('Invalid password for user:', user.email);
                    return res.status(401).json({ status: 'error', message: 'Invalid password' });
                }

                // Generate token and set cookie
                generateTokenAndSetCookie(user._id, res);

                return res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    userName: user.userName,
                    email: user.email,
                    followers: user.followers,
                    following: user.following,
                    profileImage: user.profileImage,
                    coverImage: user.coverImage,
                });

            default:
                return res.status(400).json({ status: 'error', message: 'Invalid step' });
        }
    } catch (error) {
        console.error('Error at login controller:', error.message);
        next(error);
    }
};


export const logout = async (req, res, next) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
        console.error(`error in logout controller: ${error.message}`);
        // errorHandler(error, res);
        next(error);
    }
}

export const getAuthenticatedUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.log(`error in getAuthenticatedUser controller: ${error.message}`);
        // errorHandler(error, res);
        next(error);
    }
}

