const User = require("../model/users.model");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const loginSuccessService = async (id, tokenLogin) => {
  try {
    const newTokenLogin = uuidv4();

    let user = await User.findOne({ _id: id, tokenLogin }).populate("roles");

    if (!user) {
      return {
        err: 1,
        message: "User not found or invalid token",
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
      message: "OK",
      token,
      roles: user.roles,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
  } catch (error) {
    console.error("Error in loginSuccess service:", error);
    throw new Error("Failed to process login: " + error.message);
  }
};

module.exports = {
  loginSuccessService,
};
