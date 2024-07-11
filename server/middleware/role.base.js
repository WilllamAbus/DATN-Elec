'use strict'
const jwt = require('jsonwebtoken');
const _User = require("../model/users.model");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;
const roleBase =  {
    checkPermission: async (req, res, next) =>{
        try {
            // Lấy token từ request headers
            const token = req.headers.authorization.split(' ')[1]; // Assumed Bearer token format
        
            // Giải mã token để lấy thông tin email
            const decodedToken = jwt.verify(token, secretKey);
            const email = decodedToken.email;
        
            // Tìm kiếm người dùng trong database theo email
            const user = await _User.findOne({ email }).populate('roles');
        
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
        
            // Kiểm tra các quyền của người dùng để xác định xem có quyền hay không
            const isAdmin = user.roles.some(role => role.name === 'admin');
            // const isUser = user.roles.some(role => role.name === 'user');
        
            if (!isAdmin ) {
              return res.status(403).json({ message: 'Unauthorized' });
            }
        
            // Lưu thông tin người dùng vào req để sử dụng trong các xử lý tiếp theo
            req.user = user;
            next();
          } catch (error) {
            console.error('Error in checkPermission middleware:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
          }
    }
 
};

module.exports = roleBase;
