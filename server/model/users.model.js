// const { Schema, model } = require("mongoose");
// const validator = require("validator");
// const bcrypt = require("bcrypt");
// const Role = require("./role.model");
// const userSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     password: { type: String },
//     email: { type: String, required: true, unique: true },
//     address: { type: String, require: true },
//     addressID: { type: String, require: true },
//     birthday: { type: Date, require: true },
//     gender: { type: String, enum: ["Nam", "Nữ"] },
//     phone: { type: String, require: true },
//     isEmailVerified: { type: Boolean, default: false },
//     emailVerificationToken: { type: String },
//     emailVerificationExpires: { type: Date },

//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//     avatar: String,
//     status: { type: String, default: "active" },
//     disabledAt: { type: Date, default: null },
//     socialLogin: {
//       googleId: String,
//       facebookId: String,
//     },
//     tokenLogin: String,

//     roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
//   },
//   {
//     collection: "users",
//     timestamps: true,
//   }
// );
// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (user.password && user.isModified("password")) {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(user.password, salt);
//     user.password = hash;
//   }
//   next();
// });

// userSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

// userSchema.virtual("getTime").get(() => {
//   return Date.now();
// });

// userSchema.statics.getStatics = () => {
//   return "get Statics";
// };

// userSchema.methods.getMethods = function () {
//   return `get getMethods with ${this.getTime}`;
// };

// userSchema.methods.populateRoles = async function () {
//   await this.populate("roles");
//   return this.roles;
// };

// // userSchema.pre('save', function(next) {
// //     // Kiểm tra nếu user đã có userID, không làm gì cả (giả sử userID là duy nhất và đã tồn tại)
// //     if (!this.userID) {
// //       // Tạo userID ngẫu nhiên, có thể là số ngẫu nhiên hoặc tùy chọn theo cách thức của bạn
// //       this.userID = Math.floor(Math.random() * 1000); // Ví dụ đơn giản là số ngẫu nhiên từ 0 đến 999
// //     }
// //     next();
// //   });
// module.exports = model("users", userSchema);
const { Schema, model } = require("mongoose");
// const validator = require("validator");
const bcrypt = require("bcrypt");
// const Role = require("./role.model");

const addressSchema = new Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  addressID: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});
const bankSchema = new Schema({
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  code: { type: String, required: true },
  bin: { type: String, required: true },
  shortName: { type: String, required: true },
  logo: { type: String },
  transferSupported: { type: Boolean, default: false },
  lookupSupported: { type: Boolean, default: false },
  support: { type: Number, required: true },
  isTransfer: { type: Boolean, default: false },
  swift_code: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String },
    email: { type: String },
    addresses: { type: [addressSchema], default: [] },
    birthday: { type: Date, require: true },
    gender: { type: String, enum: ["Nam", "Nữ"] },
    phone: { type: String, require: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    avatar: String,
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
    socialLogin: {
      googleId: String,
      facebookId: String,
    },
    tokenLogin: String,
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    banks: { type: [bankSchema], default: [] },
    message:{type:String},
    warning: { type: Number, default: 0 },
    timeLimit: { type: Date },
    isBanned: { type: Boolean, default: false },
    statusWarningTimeout: { type: Boolean, default: false },
    statusAuction: { type: String, default: "active" },
    noteWarning: { type: String, default: "" },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// Hash mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.password && user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

// So sánh mật khẩu
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Ví dụ về các method và static
userSchema.virtual("getTime").get(() => {
  return Date.now();
});

userSchema.statics.getStatics = () => {
  return "get Statics";
};

userSchema.methods.getMethods = function () {
  return `get getMethods with ${this.getTime}`;
};

// Populate roles của user
userSchema.methods.populateRoles = async function () {
  await this.populate("roles");
  return this.roles;
};

module.exports = model("users", userSchema);
