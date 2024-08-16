import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getNotifications, deleteAllNotifications, deleteNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get('/', protectRoute, getNotifications);
router.delete('/:id', protectRoute, deleteNotification);
router.delete('/', protectRoute, deleteAllNotifications);

export default router;