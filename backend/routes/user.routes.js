import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    getUserProfile,
    getSuggestedUsernames,
    updateUserProfileImage,
    followUnfollowUser,
    getSuggestedUsers,
    updateUser
} from "../controllers/user.controller.js";

const router = express.Router();

router.get('/profile/:identifier', protectRoute, getUserProfile);
router.post('/profile/:identifier/set-profile-image', updateUserProfileImage);
router.post('/generate-username', getSuggestedUsernames)
router.get('/suggested', protectRoute, getSuggestedUsers);
router.post('/follow/:id', protectRoute, followUnfollowUser);
router.post('/update', protectRoute, updateUser);

export default router;
