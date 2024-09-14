import express from "express";
import dotenv from 'dotenv';
import connectToDB from "./db/connectToDb.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { v2 as cloudinary } from "cloudinary";

import authRoutes from './routes/auth.routes.js'
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";


const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
}); 

app.use(express.json()); //to parse request body    
app.use(express.urlencoded({ extended: true })); //to parse form data
app.use(cookieParser()); //to parse cookies

//cors
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];

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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToDB();
});