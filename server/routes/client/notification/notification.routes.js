const express = require('express');
const router = express.Router();
const notificationController = require('../../../controler/orders/notification/notification.controller'); // Import notification controller
const middlewareController = require("../../../middleware/auth");
// Route để xóa mềm tất cả thông báo của một người dùng
router.patch('/soft-delete-notification/:userId',middlewareController.verifyToken, notificationController.softDeleteNotificationsByUser);
// Route để lấy tất cả thông báo với phân trang
router.get('/getAllNoti', notificationController.getAllNotifications);

// Route để lấy thông báo theo ID
router.get('/getNotiByID/:id', notificationController.getNotificationById);

// Route để xóa mềm thông báo theo ID
router.patch('/soft-delete-notification/:id',middlewareController.verifyTokenAdminAuth, notificationController.softDeleteNotification);

// Route để khôi phục thông báo theo ID
router.patch('/restoreNotification/:id',middlewareController.verifyTokenAdminAuth, notificationController.restoreNotification);

// Route để lấy danh sách thông báo đã xóa mềm với phân trang
router.get('/deletedList', notificationController.getDeletedNotifications);
module.exports = router;