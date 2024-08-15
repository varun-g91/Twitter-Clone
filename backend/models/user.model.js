import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Name is required'],
    },
    userName: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required']
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
    }

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User; 