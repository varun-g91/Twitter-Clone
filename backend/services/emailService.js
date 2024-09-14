import nodemailer from 'nodemailer';
import errorHandler from '../middleware/errorHandler.js';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URL for OAuth2
);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

const sendEmail = async (email, OTP) => {
    try {
        // Get a new access token
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.USERNAME,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token, // Use the new access token
            },
        });

        await transporter.sendMail({
            from: process.env.USERNAME,
            to: email,
            subject: "Verify Your Email Address",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Your Email Address</title>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f5f8fa; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
                        .content { text-align: center; padding: 20px; }
                        .content h1 { font-size: 24px; color: #1da1f2; margin-bottom: 10px; }
                        .otp-text { display: block; padding: 15px; font-size: 24px; font-weight: bold; background-color: #e1e8ed; border-radius: 5px; margin: 20px auto; width: fit-content; }
                        .footer { text-align: center; padding: 20px; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="content">
                            <h1>Verify Your Email Address</h1>
                            <p>Please use the following OTP to complete your registration:</p>
                            <div class="otp-text">${OTP}</div>
                        </div>
                        <div class="footer">
                            <p>If you did not request this, please ignore this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.log(`Error sending email: ${error.message}`);
        errorHandler(error);
    }
};

export default sendEmail;
