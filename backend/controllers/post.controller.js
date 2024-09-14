import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import errorHandler from "../middleware/errorHandler.js";
import cloudinary from 'cloudinary';
import Notification from "../models/notification.model.js";


export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { image } = req.body;

        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!text && !image) {
            return res.status(400).json({ error: 'Please provide text or image' });
        }

        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            image = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text: text,
            image: image
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });

    } catch (error) {
        console.log(`error in createPost controller: ${error.message}`);
        errorHandler(error, res);
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (post.image) {
            const imageId = post.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imageId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log(`error in deletePost controller: ${error.message}`);
        errorHandler(error, res);
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: 'Text field is required' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = { user: userId, text: text };

        post.comments.push(comment);

        await post.save();  

        res.status(200).json({ message: 'Comment added successfully', post: post });

    } catch (error) {
        console.log(`error in commentOnPost controller: ${error.message}`);
        errorHandler(error, res);
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
            res.status(200).json({ message: 'Post unliked successfully' });
        } else {
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();
            

            const notification = new Notification ({
                from: userId,
                to: post.user,
                type: "like",
            });

            await notification.save();  

            res.status(200).json({ message: 'Post liked successfully' });
        }
    } catch (error) {
        console.log(`error in likeUnlikePost controller: ${error.message}`);
        errorHandler(error, res);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate({
            path: 'user',
            select: 'fullName userName, profileImage'
        })
        .populate({
            path: 'comments.user',
            select: 'fullName userName, profileImage'
        });


        if (posts.length === 0) {
            return res.status(404).json({ error: 'No posts found' });
        }

        res.status(200).json({ message: 'Posts fetched successfully', posts: posts, count: posts.length });
    } catch (error) {
        console.log(`error in getAllPosts controller: ${error.message}`);
        errorHandler(error, res);
    }
}

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id; 

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const likedPosts = await Post.find({_id: { $in: user.likedPosts }})
        .populate({
            path: 'user',
            select: '-password'
        })
        .populate({
            path: 'comments.user',
            select: '-password'
        });

        res.status(200).json(likedPosts);
    } catch (error) {
        console.log(`error in getLikedPosts controller: ${error.message}`);
        errorHandler(error, res);   
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const following = user.following;

        const followingPosts = await Post.find({ user: { $in: following } })
        .populate({
            path: 'user',
            select: '-password'
        })
        .populate({
            path: 'comments.user',
            select: '-password'
        });

        res.status(200).json({ data: followingPosts, count: followingPosts.length });
    } catch (error) {
        console.log(`error in getFollowingPosts controller: ${error.message}`);
        errorHandler(error, res);
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ userName: username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userPosts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate({
            path: 'user',
            select: '-password'
        })
        .populate({
            path: 'comments.user',
            select: '-password'
        });

        res.status(200).json({ data: userPosts, count: userPosts.length }); 
        
    } catch (error) {
        console.log(`error in getUserPosts controller: ${error.message}`);
        errorHandler(error, res);
    }
}
