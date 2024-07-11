const { Schema, model } = require("mongoose");

const permissionSchema = new Schema({
    name: { type: String, required: true },
    resources: [{ type: String }] // Array of resource names
  });

const roleSchema = new Schema(
    {
        roleId: {type: Number, require:true,unique:true, index: true},
        name: { type: String,  unique: true },
          // Role ID
        permissions: [permissionSchema] // List of permissions
      },
  {
    collection: "roles",
    timestamps: true,
  }
);

roleSchema.pre('save', function(next) {
  // Kiểm tra nếu user đã có userID, không làm gì cả (giả sử userID là duy nhất và đã tồn tại)
  if (!this.roleId) {
    // Tạo userID ngẫu nhiên, có thể là số ngẫu nhiên hoặc tùy chọn theo cách thức của bạn
    this.roleId = Math.floor(Math.random() * 1000); // Ví dụ đơn giản là số ngẫu nhiên từ 0 đến 999
  }
  next();
});

module.exports = model("Role", roleSchema);