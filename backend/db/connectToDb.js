import mongoose from "mongoose";

const connectToDB = async () => {
    const MAX_RETRIES = 5;
    const RETRY_INTERVAL = 5000; // 5 seconds
    let retryCount = 0;

    // Configure mongoose connection settings
    mongoose.set('strictQuery', false);
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected! Attempting to reconnect...');
        retryConnection();
    });

    mongoose.connection.on('error', (error) => {
        console.log('MongoDB connection error:', error);
        retryConnection();
    });

    const retryConnection = async () => {
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying connection... Attempt ${retryCount} of ${MAX_RETRIES}`);

            setTimeout(async () => {
                try {
                    await establishConnection();
                    retryCount = 0; // Reset retry count on successful connection
                } catch (error) {
                    console.log(`Retry attempt ${retryCount} failed:`, error.message);
                }
            }, RETRY_INTERVAL);
        } else {
            console.log('Max retry attempts reached. Please check your connection settings.');
            process.exit(1);
        }
    };

    const establishConnection = async () => {
        try {
            await mongoose.connect(process.env.CONNECTION_URI, {
                serverSelectionTimeoutMS: 4000, // Timeout after 4 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
                maxPoolSize: 10,
                retryWrites: true,
                connectTimeoutMS: 5000,
            });

            console.log(`MongoDB connected: ${mongoose.connection.host}`);
        } catch (error) {
            throw error;
        }
    };

    // Initial connection attempt
    try {
        await establishConnection();
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`);
        retryConnection();
    }
};

export default connectToDB;