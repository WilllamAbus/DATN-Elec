const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Role = require("./role.model");
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String, require: true },
    birthday: { type: Date, require: true },
    gender: { type: String, enum: ["Nam", "Nữ"] },
    phone: { type: String, require: true },
    VerifiedEmail: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    status: { type: String, default: "Hoạt động" },
    socialLogin: {
      googleId: String,
      facebookId: String,
    },
    tokenLogin: String,
    avatar: String,
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  },
  {
    collection: "users",
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.password && user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual("getTime").get(() => {
  return Date.now();
});

userSchema.statics.getStatics = () => {
  return "get Statics";
};

userSchema.methods.getMethods = function () {
  return `get getMethods with ${this.getTime}`;
};

userSchema.methods.populateRoles = async function () {
  await this.populate("roles");
  return this.roles;
};

// userSchema.pre('save', function(next) {
//     // Kiểm tra nếu user đã có userID, không làm gì cả (giả sử userID là duy nhất và đã tồn tại)
//     if (!this.userID) {
//       // Tạo userID ngẫu nhiên, có thể là số ngẫu nhiên hoặc tùy chọn theo cách thức của bạn
//       this.userID = Math.floor(Math.random() * 1000); // Ví dụ đơn giản là số ngẫu nhiên từ 0 đến 999
//     }
//     next();
//   });
module.exports = model("users", userSchema);
