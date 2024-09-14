import User from '../models/user.model.js';

export const createUser = async (userData) => {
    try {
        // Prepare user data, explicitly handling undefined values
        const user = {
            fullName: userData.fullName,
            userName: userData.userName,
            dateOfBirth: userData.dateOfBirth,
            verificationCode: userData.verificationCode,
            verificationCodeExpires: userData.verificationCodeExpires,
            isVerified: userData.isVerified,
        };

        // Include email if provided
        if (userData.email) {
            user.email = userData.email;
        }

        // Include phone if provided
        if (userData.phone) {
            user.phone = userData.phone;
        }

        // Create user in the database
        const result = await User.create(user);

        return result;
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw error;
    }
};



export const findUserByEmailOrPhone = async (identifier) => {
    return await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
    });
};

export const checkUsernameAvailability = async (userName) => {
    return await User.findOne({ userName });
};
