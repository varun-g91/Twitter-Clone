import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import AppError from '../utils/AppError.js';

dotenv.config();

let transporter = null;
let oAuth2Client = null;

const validateEnvironmentVars = () => {
    const requiredEnvVars = [
        'OAUTH2_CLIENT_ID',
        'OAUTH2_CLIENT_SECRET',
        'OAUTH2_REFRESH_TOKEN',
        'OAUTH2_USER'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new AppError(
            `Missing required environment variables: ${missingVars.join(', ')}`,
            500
        );
    }
};

const initializeOAuth2Client = () => {
    try {
        if (!oAuth2Client) {
            validateEnvironmentVars();

            oAuth2Client = new google.auth.OAuth2(
                process.env.OAUTH2_CLIENT_ID,
                process.env.OAUTH2_CLIENT_SECRET,
                'https://developers.google.com/oauthplayground'
            );

            oAuth2Client.setCredentials({
                refresh_token: process.env.OAUTH2_REFRESH_TOKEN
            });

            // Set up automatic token refresh
            oAuth2Client.on('tokens', (tokens) => {
                if (tokens.refresh_token) {
                    // Store the new refresh token if we got one
                    process.env.OAUTH2_REFRESH_TOKEN = tokens.refresh_token;
                    console.log('New refresh token received:', tokens.refresh_token);
                }
                console.log('Access token refreshed');
            });
        }
        return oAuth2Client;
    } catch (error) {
        console.error('Error initializing OAuth2 client:', error);
        throw new AppError(
            'Failed to initialize email authentication',
            500
        );
    }
};

const createTransporter = async () => {
    try {
        const oauth2Client = initializeOAuth2Client();
        console.log('OAuth2 client initialized');

        // Get a new access token
        const accessTokenResponse = await oauth2Client.getAccessToken();
        console.log('Access token obtained');

        if (!accessTokenResponse || !accessTokenResponse.token) {
            throw new Error('Failed to obtain access token');
        }

        const { token: accessToken } = accessTokenResponse;

        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.OAUTH2_USER,
                clientId: process.env.OAUTH2_CLIENT_ID,
                clientSecret: process.env.OAUTH2_CLIENT_SECRET,
                refreshToken: process.env.OAUTH2_REFRESH_TOKEN,
                accessToken,
                expires: 3600
            },
            pool: true,
            maxConnections: 5,
            rateDelta: 1000, // Space requests by 1 second
            rateLimit: 30,   // 30 emails per second max
            timeout: 30000   // 30 second timeout
        });

        // Verify the transporter configuration
        await transporter.verify();
        console.log('Transporter verified successfully');

        return transporter;

    } catch (error) {
        console.error('Detailed error in createTransporter:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data,
            code: error.code
        });

        if (error.response?.data?.error === 'invalid_grant') {
            // Log the error for monitoring
            console.error('OAuth2 credentials need to be renewed:', error);

            // Reset the transporter and OAuth client
            transporter = null;
            oAuth2Client = null;

            throw new AppError(
                'Email service temporarily unavailable. Our team has been notified.',
                503
            );
        }

        throw new AppError(
            'Email service initialization failed. Please try again later.',
            500
        );
    }
};

const generateEmailTemplate = (OTP) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
        }
        body {
            padding: 10px;
            color: #1F2933;
        }
        .verification-code {
            font-size: 1.5em;
            font-weight: bold;
            margin: 15px 0;
            text-align: center;
            background-color: #f0f4f8;
            padding: 10px;
            border-radius: 5px;
            letter-spacing: 2px;
            color: #0078d7;
        }
    </style>
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1F2933; margin-bottom: 10px;">Email Verification</h1>
            <p style="color: #4A5568; margin-bottom: 20px;">Please use the following verification code to complete your registration:</p>
            <div class="verification-code">
                ${OTP}
            </div>
            <p style="color: #4A5568; margin-top: 20px;">This code will expire in 10 minutes.</p>
            <p style="color: #4A5568;">Thank you for registering with us!</p>
        </div>
    </div>
</body>
</html>`;
};

const sendEmail = async (email, OTP) => {
    try {
        if (!email || !OTP) {
            throw new AppError('Email and OTP are required', 400);
        }

        if (!transporter) {
            transporter = await createTransporter();
        }

        const mailOptions = {
            from: `X <${process.env.OAUTH2_USER}>`,
            to: email,
            subject: `${OTP} is your verification code`,
            html: generateEmailTemplate(OTP)
        };

        const result = await transporter.sendMail(mailOptions);
        return result;

    } catch (error) {
        console.error('Email sending error:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data,
            code: error.code
        });

        // Reset transporter if there's an auth error
        if (error.response?.data?.error === 'invalid_grant' ||
            error.code === 'EAUTH') {
            transporter = null;
            oAuth2Client = null;
            throw new AppError(
                'Email service temporarily unavailable. Please try again shortly.',
                503
            );
        }

        // Handle rate limiting
        if (error.code === 'EMESSAGE') {
            throw new AppError(
                'Too many email requests. Please try again in a few minutes.',
                429
            );
        }

        // General connection errors
        if (['ECONNECTION', 'ECONNREFUSED', 'ETIMEDOUT'].includes(error.code)) {
            transporter = null;
            throw new AppError(
                'Unable to connect to email service. Please try again later.',
                503
            );
        }

        // If it's already an AppError, rethrow it
        if (error instanceof AppError) {
            throw error;
        }

        // Generic error
        throw new AppError(
            'Failed to send verification email. Please try again.',
            500
        );
    }
};

// Helper function to generate OAuth2 URL (useful for initial setup)
export const generateOAuth2URL = () => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH2_CLIENT_ID,
        process.env.OAUTH2_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );

    const scopes = [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.compose'
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
};

export default sendEmail;