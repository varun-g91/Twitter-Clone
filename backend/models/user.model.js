import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Name is required'],
    },
    userName: {
        type: String,
        unique: true,
        sparse: true, // Allows null initially, set after verification
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows null if phone is used for signup
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allows null if email is used for signup
    },
    password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
    },
    verificationCodeExpires: {
        type: Date,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    profileImage: {
        type: String,
        default: '',
    },
    coverImage: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    link: {
        type: String,
        default: '',
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: [],
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
