const User = require("../model/users.model");
const WathList = require("../model/wathlist");
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
        .sort({ createdAt: -1 })
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
const getdisableLimitService = (page, search) =>
  new Promise(async (resolve, reject) => {
    try {
      const limit = parseInt(process.env.LIMIT, 10) || 3;
      const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;

      let searchQuery = { status: "disable" };

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
        .sort({ createdAt: -1 })
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

const getWathlistLimitService = (userId, page, search) =>
  new Promise(async (resolve, reject) => {
    try {
      const limit = parseInt(process.env.LIMITV2, 10) || 3;
      const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;

      let searchQuery = { user: userId };

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

      const data = await WathList.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate({
          path: "product",
        })
        .populate({
          path: "productVariant",
          populate: [
            {
              path: "image",
            },
            {
              path: "ram",
            },
            {
              path: "storage",
            },
          ],
        })
        .lean();

      const total = await WathList.countDocuments(searchQuery);

      resolve({
        success: true,
        err: 0,
        msg: data.length ? "OK" : "No users found.",
        status: 200,
        response: {
          total,
          data,
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
  getdisableLimitService,
  getWathlistLimitService,
};
