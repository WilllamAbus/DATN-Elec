const notificationService = require('../../../services/notification/notification.service');
const notificationController = {
    getNotificationsForUser: async (req, res) => {
      try {
        const { userId } = req.query; // Lấy userId từ URL
        const notifications = await notificationService.getNotificationsByUserId(userId);
  
        if (!notifications || notifications.length === 0) {
          return res.status(404).json({ message: 'No notifications found.' });
        }
  
        res.status(200).json(notifications); // Trả về danh sách thông báo
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    softDeleteNotificationsByUser: async (req, res) => {
        try {
          const { userId } = req.query; // Lấy userId từ URL
          const result = await notificationService.softDeleteNotificationsByUser(userId);
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },

      getAllNotifications: async (req, res) => {
        try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const result = await notificationService.getAllNotifications(page, limit);
    
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    
      getNotificationById: async (req, res) => {
        try {
          const { id } = req.query;
          const notification = await notificationService.getNotificationById(id);
          res.status(200).json(notification);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    
      softDeleteNotification: async (req, res) => {
        try {
          const { id } =req.params;
          const notification = await notificationService.softDeleteNotification(id);
          res.status(200).json(notification);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    
      restoreNotification: async (req, res) => {
        try {
          const { id } = req.params;
          const notification = await notificationService.restoreNotification(id);
          res.status(200).json(notification);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    
      getDeletedNotifications: async (req, res) => {
        try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 5;
          const result = await notificationService.getDeletedNotifications(page, limit);
    
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
  };
  
  module.exports = notificationController;