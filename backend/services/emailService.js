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
            subject: `${OTP} is your verification code`,
            html: `<!DOCTYPE html>
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
            list-style: none;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
            outline: none;
            text-transform: none;
            text-decoration: none;
        }
        body {
            padding: 10px;
            color: #1F2933;
            word-break: break-word;
        }
        ol li {
            list-style-type: decimal !important;
            list-style-position: inside;
            display: list-item;
        }
        h1 {
            font-size: 1.3725em;
            line-height: 1.4em;
            margin-bottom: 15px;
        }
        h2, h3 {
            font-size: 1.1875em;
            line-height: 1.4em;
            margin: .3em auto .5em;
        }
        p {
            line-height: 1.5em;
            font-size: 1em;
            margin-bottom: .5em;
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
        span {
            color: #0078d7;
        }
        body::-webkit-scrollbar {
            -webkit-appearance: none;
            height: 8px;
            width: 8px;
        }
        body::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, .26);
        }
        code {
            word-wrap: break-word;
            white-space: pre-wrap;
        }
        @media only screen and (max-width: 500px) {
            .width_full {
                width: 100% !important;
                min-width: 360px !important;
            }
            .width_20 {
                width: 20px !important;
            }
            #hide, .hide {
                display: none !important;
            }
            .height_30 {
                height: 30px !important;
            }
        }
    </style>
</head>
<body>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff" class="wrapper" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto;">
        <tbody>
            <tr>
                <td width="100%" align="center" style="padding:0px;margin:0px auto;">
                    <!-- BODY START -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#F5F8FA" width="100%" class="width_full" dir="ltr" style="padding:0px;margin:0px auto;">
                        <tbody>
                            <tr>
                                <td style="padding:0px;margin:0px auto;">
                                    <table cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#ffffff" width="450" class="width_full" style="padding:0px;margin:0px auto;">
                                        <tbody>
                                            <tr>
                                                <td width="24" style="padding:0px;"> &nbsp; </td>
                                                <td style="padding:0px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" align="center" dir="ltr" style="padding:0px;margin:0px auto;">
                                                        <tbody>
                                                            <tr>
                                                                <td height="24" style="padding:0px;"> &nbsp; </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" style="padding:0px;">
                                                                    <svg aria-hidden='true' viewBox='0 0 24 24' width="24" height="24">
                                                                        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                                                                    </svg>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" style="padding: 20px 0;">
                                                                    <h1>Email Verification</h1>
                                                                    <p>Please use the following verification code to complete your registration:</p>
                                                                    <div class="verification-code">
                                                                        <!-- Your verification code here -->
                                                                        <span>${OTP}</span>
                                                                    </div>
                                                                    <p>Thank you for registering with us!</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td height="24" style="padding:0px;"> &nbsp; </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td width="24" style="padding:0px;"> &nbsp; </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- BODY END -->
                </td>
            </tr>
        </tbody>
    </table>
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
