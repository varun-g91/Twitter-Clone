import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ to: userId })
        .populate({
            path: 'from',
            select: 'userName profileImage'
        });

        await Notification.updateMany({to: userId}, {read: true});

        res.status(200).json({data: notifications, count: notifications.length});
    } catch (error) {
        console.log(`error in getNotifications controller: ${error.message}`);
        // errorHandler(error, res);
        next(error);
    }
}
export const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({to: userId}); 

        res.status(200).json({message: 'Notifications deleted successfully'});
    } catch (error) {
        console.log(`error in deleteNotifications controller: ${error.message}`);
        // errorHandler(error, res);
        next(error);
    }
}

export const deleteNotification = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        if (notification.to.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await Notification.findByIdAndDelete(id);
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.log(`error in deleteNotification controller: ${error.message}`);
        // errorHandler(error, res);
        next(error);
    }
}

