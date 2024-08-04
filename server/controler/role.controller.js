// Module

const { insertRole } = require("../services/role.service");

const roleController = {
  createRole: async (req, res) => {
    const { roleName, permissions } = req.body;
    try {
      const newRole = await insertRole(roleName, permissions);
      res.status(201).json({
        message: "Add Role Success!!!",
        elements: newRole,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = roleController;
