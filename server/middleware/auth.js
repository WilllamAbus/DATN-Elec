const jwt = require("jsonwebtoken");
const Role = require("../model/role.model");
const User = require("../model/users.model");
const middlewareController = {

  verifyToken: async (req, res, next) => {
    const token = req.headers["authorization"];

    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, async (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid");
        }

        // Lấy thông tin người dùng từ token và gán vào req.user
        req.user = user;

        try {
          // Kiểm tra trạng thái tài khoản người dùng
          const currentUser = await User.findById(user.id);
          if (currentUser && currentUser.status !== "active") {
            return res.status(403).json("Your account is not active");
          }

          // Nếu trạng thái hợp lệ, tiếp tục xử lý
          next();
        } catch (error) {
          return res
            .status(500)
            .json("Server error while checking user status");
        }
      });
    } else {
      return res.status(401).json("You're not authenticated");
    }
  },
  verifyTokenAdminAuth: async (req, res, next) => {
    await middlewareController.verifyToken(req, res, async () => {
      const userRoles = req.user.roles;

      const adminRole = await Role.findOne({ name: "admin" });

      if (adminRole) {
        const adminRoleId = adminRole._id.toString();
        const hasAdminRole = userRoles.some(
          (role) => role._id.toString() === adminRoleId
        );

        if (hasAdminRole) {
          next();
        } else {
          res
            .status(403)
            .json("Access denied: Only admins can access this route");
        }
      } else {
        res.status(403).json("Access denied: Admin role not found");
      }
    });
  },

  getHeader: async (req, res, next) => {
    const token = req.headers["authorization"];

    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          req.user = null;
          next();
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      req.user = null;
      next();
    }
  },

  verifyTokenUserAuth: async (req, res, next) => {
    await middlewareController.verifyToken(req, res, async () => {
      const userRoles = req.user.roles;

      const adminRole = await Role.findOne({ name: "user" });

      if (adminRole) {
        const adminRoleId = adminRole._id.toString();
        const hasAdminRole = userRoles.some(
          (role) => role._id.toString() === adminRoleId
        );

        if (hasAdminRole) {
          next();
        } else {
          res
            .status(403)
            .json("Access denied: Only admins can access this route");
        }
      } else {
        res.status(403).json("Access denied: Admin role not found");
      }
    });
  },
};
module.exports = middlewareController;
