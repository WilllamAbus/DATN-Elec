const User = require("../../model/users.model");

const BankController = {
  addBank: async (req, res) => {
    try {
      const userId = req.user.id;
      const bankData = req.body;

      console.log("Bank data received:", bankData);

      if (!bankData || !bankData.name || !bankData.code) {
        return res
          .status(400)
          .json({ message: "Thông tin ngân hàng không đầy đủ" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      console.log("Current banks:", user.banks);

      if (user.banks.length >= 5) {
        return res
          .status(400)
          .json({ message: "Bạn chỉ được thêm tối đa 5 ngân hàng" });
      }

      const isFirstBank = user.banks.length === 0;

      const newBank = {
        ...bankData,
        isDefault: isFirstBank,
      };

      user.banks.push(newBank);
      const updatedUser = await user.save();

      console.log("Updated user:", updatedUser);

      res
        .status(201)
        .json({ message: "Ngân hàng đã được thêm", banks: updatedUser.banks });
    } catch (error) {
      console.error("Error adding bank:", error);
      res.status(500).json({ message: "Có lỗi xảy ra", error });
    }
  },

  getBanks: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      res.json({ banks: user.banks });
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra", error });
    }
  },

  updateBank: async (req, res) => {
    try {
      const userId = req.user.id;
      const { bankData } = req.body;
      const { bankId } = req.params;

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      const bank = user.banks.id(bankId);
      if (!bank)
        return res.status(404).json({ message: "Ngân hàng không tồn tại" });

      Object.assign(bank, bankData);
      await user.save();

      res.json({ message: "Ngân hàng đã được cập nhật", banks: user.banks });
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra", error });
    }
  },

  // Xóa ngân hàng khỏi danh sách
  deleteBank: async (req, res) => {
    try {
      const userId = req.user.id;
      const { bankId } = req.params;

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      const bank = user.banks.id(bankId);
      if (!bank)
        return res.status(404).json({ message: "Ngân hàng không tồn tại" });

      bank.remove();
      await user.save();

      res.json({ message: "Ngân hàng đã được xóa", banks: user.banks });
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra", error });
    }
  },
};

module.exports = BankController;
