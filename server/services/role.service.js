// Module
const _Role = require("../model/role.model");

const roleService = {
  insertRole: async (roleName, permissions = []) => {
    try {
      // Kiểm tra xem role đã tồn tại chưa
      const existingRole = await _Role.findOne({ name: roleName });
      if (existingRole) {
        throw new Error("Role already exists");
      }

      // Tạo mảng các đối tượng permission
      const permissionObjects = permissions.map((permission) => {
        const [name, resourcesString] = Object.entries(permission)[0];
        const resources = resourcesString
          .split(",")
          .map((resource) => resource.trim());
        return { name, resources };
      });

      // Tạo một role mới
      const newRole = _Role.create({
        name: roleName,
        permissions: permissionObjects,
      });

      // Lưu role vào cơ sở dữ liệu

      return newRole ? 1 : 0;
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = roleService;
