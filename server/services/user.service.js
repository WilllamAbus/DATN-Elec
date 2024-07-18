"use strict";

// Module
const _User = require("../model/users.model");
const _Otp = require("../model/otp.model");
const otpGenerator = require("otp-generator");
const jwt = require('jsonwebtoken');
const validator = require('validator'); 
const _Role = require("../model/role.model");
// service
const { insertOTP, validOtp } = require("./otp.service");


// config
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;
const userService = {
  verifyOtp: async ({ email, otp }) => {
    try {
      const otpHolder = await _Otp.find({
        email,
      });

      if (!otpHolder.length) {
        return {
          code: 400,
          message: "Expired Otp",
        };
      }

      const lastOtp = otpHolder[otpHolder.length - 1];
      const isValid = await validOtp({
        otp,
        hashOtp: lastOtp.otp,
      });

      if (!isValid) {
        return {
          code: 401,
          message: "inValdi Otp!!!",
        };
      }

      if (isValid && email === lastOtp.email) {
        if (!validator.isEmail(email)) {
          return {
              code: 400,
              message: "Invalid email format",
          };
      }
      const role = await _Role.findOne({ name: "admin" });
      if (!role) {
          return {
              code: 400,
              message: "Role not found",
          };
      }
     
      const user = await _User.create({
        email,
        roles: [role._id],
   // Đảm bảo giá trị userId được tạo đúng
    });

    if (user) {
        await _Otp.deleteMany({ email });
    }

    // Populate roles sau khi tạo người dùng
    await user.populate('roles');
 
  
        const token = jwt.sign(
          {
            roles: user.roles,
            id: user._id, // Thay đổi role tùy theo logic của bạn
            // Sử dụng _id của user trong MongoDB
            email: user.email,
          },
          secretKey,
          { expiresIn: "1h" }
        );
   
        // Tạo JWT token sử dụng secretKey từ biến môi trường
      

        return {
          code: 201,
          message:"Successfully!",
          token:token,
          elements: user,
        };
      }
    } catch (error) {
      console.error(error);
    }
  },
  regisUser: async ({ email }) => {
    const user = await _User.findOne({
      email,
    });
    if (user) {
      return {
        code: 400,
        message: "This email is already in user!",
      };
    }

    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    

    return {
      code: 200,
      message: "Successfully",
      OTP: OTP,
      elements: await insertOTP({
        email,
        otp: OTP,
      }),
    };
  },
};

module.exports = userService;
