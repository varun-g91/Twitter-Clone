import express from "express";
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'
import connectToDB from "./db/connectToDb.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
}); 

app.use(express.json()); //to parse request body    
app.use(express.urlencoded({ extended: true })); //to parse form data
app.use(cookieParser()); //to parse cookies

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToDB();
});