const { Schema, model } = require("mongoose");

const otpSchema = Schema(
  {
    email: String,
    otp: String,
  },
  {
    collection: "otp",
    timestamps: true,
  }
);

module.exports = model("otp", otpSchema);
