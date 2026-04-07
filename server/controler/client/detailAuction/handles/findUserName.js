const User = require('../../../../model/users.model'); // Đảm bảo rằng bạn có model User trong dự án của bạn

const findUserName = async (userId) => {
  try {
    const user = await User.findById(userId).select('name'); // Lấy tên người dùng
    if (!user) {
      return null;
    }
    return user.name;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

module.exports = findUserName;
