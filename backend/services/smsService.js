import twilio from 'twilio';
import dotenv from 'dotenv';
import AppError from '../utils/AppError.js';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID; // Add this to your .env file
const client = twilio(accountSid, authToken);

// Function to send a verification SMS to the provided phone number
const sendVerificationSMS = async (phoneNumber, verificationCode) => {
    try {
        const message = await client.messages.create({
            body: `Your verification code is ${verificationCode}. It expires in 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,  // Ensure you have this in your .env
            to: phoneNumber,
        });

        console.log(`Verification SMS with code ${verificationCode} sent to ${phoneNumber}: ${message.sid}`);
        return message.sid;
    } catch (error) {
        console.error(`Failed to send verification SMS to ${phoneNumber}: ${error.message}`);
        throw new AppError('Could not send verification SMS.');
    }
};


export default sendVerificationSMS;