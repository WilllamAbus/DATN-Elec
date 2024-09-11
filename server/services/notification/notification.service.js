'use strict'

const Notification = require('../../model/notification/notification.model');
const notificationService = {
    getNotificationsByUserId: async (userId) => {
        try {
          const notifications = await Notification.find({ 
            user: userId, 
            isActive: true, 
            isRead: true,
            status: 'active' 
          })
          .sort({ modifieon: -1 }) // Sắp xếp thông báo theo thời gian gần nhất
          .populate('user', 'avatar') // Lấy trường avatar từ user
          .exec();
    
          return notifications;
        } catch (error) {
          throw new Error(`Error retrieving notifications: ${error.message}`);
        }
      },

      getAllNotifications: async (page = 1, limit = 10) => {
        try {
          const skip = (page - 1) * limit;
          const notifications = await Notification.find({ 
            isActive: true, 
            status: 'active' 
          })
          .skip(skip)
          .limit(limit)
          .sort({ modifieon: -1 }) // Sắp xếp theo thời gian gần nhất
          .exec();
    
          const totalCount = await Notification.countDocuments({ 
            isActive: true, 
            status: 'active' 
          });
    
          return {
            notifications,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
          };
        } catch (error) {
          throw new Error(`Error retrieving notifications: ${error.message}`);
        }
      },
    
      getNotificationById: async (id) => {
        try {
          const notification = await Notification.findById(id).exec();
          if (!notification) {
            throw new Error('Notification not found');
          }
          return notification;
        } catch (error) {
          throw new Error(`Error retrieving notification: ${error.message}`);
        }
      },
    
      softDeleteNotification: async (id) => {
        try {
          const nowUtc = new Date();
          const offset = 7 * 60 * 60 * 1000; // Chuyển đổi thời gian UTC sang múi giờ Việt Nam (UTC + 7)
          const now = new Date(nowUtc.getTime() + offset);
    
          const notification = await Notification.findByIdAndUpdate(
            id,
            { status: 'disable', disabledAt: now },
            { new: true }
          ).exec();
    
          if (!notification) {
            throw new Error('Notification not found');
          }
    
          return notification;
        } catch (error) {
          throw new Error(`Error soft deleting notification: ${error.message}`);
        }
      },

      softDeleteNotificationsByUser: async (userId) => {
        try {
          const nowUtc = new Date();
          const offset = 7 * 60 * 60 * 1000; // Chuyển đổi thời gian UTC sang múi giờ Việt Nam (UTC + 7)
          const now = new Date(nowUtc.getTime() + offset);
    
          const result = await Notification.updateMany(
            { user: userId, isRead: true , isActive: true},
            { status: 'disable', disabledAt: now, isActive: false, isRead: false },
            { new: true }
          ).exec();
    
          if (result.nModified === 0) {
            throw new Error('Không có thông báo nào để xóa mềm');
          }
    
          return { message: `${result.nModified} thông báo đã được xóa mềm` };
        } catch (error) {
          throw new Error(`Error soft deleting notifications: ${error.message}`);
        }
      },
    
      restoreNotification: async (id) => {
        try {
          const notification = await Notification.findByIdAndUpdate(
            id,
            { status: 'active',isRead: true , isActive: true, disabledAt: null },
            { new: true }
          ).exec();
    
          if (!notification) {
            throw new Error('Notification not found');
          }
    
          return notification;
        } catch (error) {
          throw new Error(`Error restoring notification: ${error.message}`);
        }
      },
    
      getDeletedNotifications: async (page = 1, limit = 5) => {
        try {
          const skip = (page - 1) * limit;
          const notifications = await Notification.find({ 
            status: 'disable' 
          })
          .skip(skip)
          .limit(limit)
          .sort({ disabledAt: -1 }) // Sắp xếp theo thời gian bị xóa
          .exec();
    
          const totalCount = await Notification.countDocuments({ 
            status: 'disable' 
          });
    
          return {
            notifications,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
          };
        } catch (error) {
          throw new Error(`Error retrieving deleted notifications: ${error.message}`);
        }
      },
}

module.exports = notificationService