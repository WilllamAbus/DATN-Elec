const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const permissionSchema = new Schema({
  name: { type: String, required: true },
  resources: [{ type: String }],
});

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [permissionSchema],
  },
  {
    collection: "roles",
    timestamps: true,
  }
);

roleSchema.pre("save", function (next) {
  if (!this.roleId) {
    this.roleId = uuidv4();
  }
  next();
});

module.exports = model("Role", roleSchema);
