const modelProduct = require("../../model/product.model");
const Role = require('../../model/role.model');

exports.add = async (req, res) => {
    try {
        // Fetch role details
        const adminRole = await Role.findOne({ name: 'admin' });

        if (!adminRole) {
            return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
        }


        if (!req.user.roles.includes(adminRole._id.toString())) {
            return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể thêm sản phẩm" });
        }


        let { name, price, quantity, categoryid, createdAt, weight, brand, color, description, discount } = req.body;


        if (!name || !price || !quantity || !categoryid || discount === undefined) {
            return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
        }

        // Ensure discount is a number or specific type if required
        if (typeof discount === 'string' && (discount !== 'Available' && discount !== 'Not Available')) {
            return res.status(400).json({ message: "Discount value is invalid" });
        }

        // Parse createdAt if it exists
        if (createdAt) {
            createdAt = new Date(createdAt);
        } else {
            createdAt = new Date();
        }

        // Prepare data for saving
        let data = { name, price, quantity, categoryid, createdAt, weight, brand, color, description, discount };

        // Save to database
        const savedProduct = await modelProduct.create(data);

        res.status(201).json({ message: "Sản phẩm được tạo thành công", savedProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
