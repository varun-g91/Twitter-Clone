import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_URI);
        console.log(`MongoDb connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to mongoDb: ${error.message}`);
        process.exit(1);
    }
}

export default connectToDB;