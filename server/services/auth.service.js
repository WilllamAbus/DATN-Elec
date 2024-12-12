const User = require("../model/users.model");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const loginSuccessService = async (id, tokenLogin) => {
  try {
    const newTokenLogin = uuidv4();

    let user = await User.findOne({ _id: id, tokenLogin });

    if (!user) {
      return {
        err: 1,
        msg: "User not found or invalid token",
      };
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        roles: user.roles,
        name: user.name,
        avatar: user.avatar,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "5d" }
    );

    await User.updateOne({ _id: id }, { tokenLogin: newTokenLogin });

    return {
      err: 0,
      msg: "OK",
      token,
    };
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error in loginSuccess service:", error);
    throw new Error("Failed to process login: " + error.message);
  }
};
// const getUseLimitService = (page, search, stateOrder) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const limit = parseInt(process.env.LIMIT, 10) || 3;
//       const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;
//       // Khởi tạo điều kiện tìm kiếm
//       let searchQuery = { status: "active" }; // Lọc chỉ user đang hoạt động

//       // Tìm kiếm theo tên, email hoặc số điện thoại
//       if (search) {
//         searchQuery = {
//           ...searchQuery,
//           $or: [
//             { name: { $regex: search, $options: "i" } },
//             { email: { $regex: search, $options: "i" } },
//             { phone: { $regex: search, $options: "i" } },
//           ],
//         };
//       }
//       // Áp dụng bộ lọc trạng thái (nếu có)
//       if (stateOrder) {
//         searchQuery = { ...searchQuery, "orders.stateOrder": stateOrder };
//       }
//       // Truy vấn dữ liệu
//       const users = await User.find(searchQuery)
//         .skip(offset)
//         .limit(limit)
//         .populate({
//           path: "roles",
//           select: "name description",
//         }) // Truy vấn role
//         .populate({
//           path: "banks",
//           match: { isDefault: true },
//           select: "name accountNumber logo",
//         }) // Truy vấn ngân hàng mặc định
//         .lean();

//       // Đếm tổng số tài khoản phù hợp
//       const total = await User.countDocuments(searchQuery);
//       // Trả về kết quả
//       resolve({
//         success: true,
//         err: 0,
//         msg: users.length ? "OK" : "No users found.",
//         status: 200,
//         response: {
//           total,
//           users,
//         },
//       });
//     } catch (error) {
//       reject({
//         success: false,
//         err: 1,
//         msg: "Error retrieving users: " + error.message,
//         status: 500,
//       });
//     }
//   });

const getUseLimitService = (page, search) =>
  new Promise(async (resolve, reject) => {
    try {
      const limit = parseInt(process.env.LIMIT, 10) || 3;
      const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;

      let searchQuery = { status: "active" };

      if (search) {
        searchQuery = {
          ...searchQuery,
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        };
      }

      const users = await User.find(searchQuery)
        .skip(offset)
        .limit(limit)
        .populate({
          path: "roles",
          select: "name description",
        })
        .populate({
          path: "banks",
          match: { isDefault: true },
          select: "name accountNumber logo",
        })
        .lean();

      const total = await User.countDocuments(searchQuery);

      resolve({
        success: true,
        err: 0,
        msg: users.length ? "OK" : "No users found.",
        status: 200,
        response: {
          total,
          users,
        },
      });
    } catch (error) {
      reject({
        success: false,
        err: 1,
        msg: "Error retrieving users: " + error.message,
        status: 500,
      });
    }
  });

module.exports = {
  loginSuccessService,
  getUseLimitService,
};
