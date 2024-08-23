const User = require("../model/users.model");
const { v4: uuidv4 } = require("uuid");

const loginSuccessService = async (id, tokenLogin) => {
  try {
    const newTokenLogin = uuidv4();
    const user = await User.findOne({ _id: id, tokenLogin }).populate("roles");

    if (!user) {
      console.log("User not found or invalid token");
      return {
        err: 1,
        message: "User not found or invalid token",
      };
    }

    await User.updateOne({ _id: id }, { tokenLogin: newTokenLogin });

    return {
      err: 0,
      message: "OK",
      user,
    };
  } catch (error) {
    console.error("Error in loginSuccess service:", error);
    throw new Error("Failed to process login: " + error.message);
  }
};
module.exports = {
  loginSuccessService,
};
