// Imports
import express from "express";
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import connectToDB from "./db/connectToDb.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { v2 as cloudinary } from "cloudinary";

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import testFileUpload from "./utils/testFileUpload.js";
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(express.json({ limit: '50mb' })); // to parse request body
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // to parse form data
app.use(cookieParser()); // to parse cookies

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
const corsConfig = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    operationSuccessStatus: 200
};
app.use(cors(corsConfig));

// Using express-fileupload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    abortOnLimit: true // Cancel uploads over limit
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/test', testFileUpload);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToDB();
});
