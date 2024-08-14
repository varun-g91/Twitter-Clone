import express from "express";
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'
import connectToDB from "./db/connectToDb.js";
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //to parse request body    
app.use(express.urlencoded({ extended: true })); //to parse form data
app.use(cookieParser()); //to parse cookies

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToDB();
});