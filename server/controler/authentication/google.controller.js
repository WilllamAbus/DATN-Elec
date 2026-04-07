// const authService = require("../../services/authGoogle.service");
// const { generateToken, generateRefreshToken } = require("./auth.controller");
// let refreshTokens = [];
// const loginSuccess = async (req, res) => {
//   const { id, tokenLogin } = req.body;

//   try {
//     if (!id || !tokenLogin) {
//       return res
//         .status(400)
//         .json({ err: 1, message: "Thiếu thông tin đầu vào" });
//     }

//     let response = await authService.loginSuccessService(id, tokenLogin);

//     if (response.err === 1) {
//       console.log(
//         "Người dùng không tìm thấy hoặc token không hợp lệ:",
//         id,
//         tokenLogin
//       );
//       return res
//         .status(401)
//         .json({ message: "Thông tin đăng nhập không chính xác" });
//     }

//     const user = response.user;

//     if (!user.isEmailVerified) {
//       return res.status(400).json({ message: "Email chưa được xác minh" });
//     }

//     if (user.status !== "active") {
//       console.log("Tài khoản đã bị khóa");
//       return res.status(400).json({ message: "Tài khoản đã bị khóa" });
//     }

//     const token = generateToken(user);
//     const refreshToken = generateRefreshToken(user);
//     refreshTokens.push(refreshToken);

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       path: "/",
//       sameSite: "strict",
//     });

//     const { password, ...others } = user._doc;

//     return res
//       .status(200)
//       .json({ ...others, accessToken: token, roles: user.roles });
//   } catch (error) {
//     console.error("Lỗi trong loginSuccess controller:", error);
//     return res.status(500).json({
//       err: -1,
//       message: "Xử lý đăng nhập thất bại: " + error.message,
//     });
//   }
// };

// module.exports = {
//   loginSuccess,
// };
