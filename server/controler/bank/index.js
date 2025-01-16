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
      if (
        !bankData.accountNumber ||
        bankData.accountNumber.length < 8 ||
        bankData.accountNumber.length > 15
      ) {
        return res
          .status(400)
          .json({ message: "Số tài khoản phải từ 8 đến 15 ký tự" });
      }
      if (
        !bankData.fullName ||
        !/^[a-zA-ZÀ-ỹ\s]+$/.test(bankData.fullName) ||
        bankData.fullName.length > 25
      ) {
        return res
          .status(400)
          .json({
            message:
              "Họ tên chỉ được chứa chữ cái, khoảng trắng và không quá 25 ký tự",
          });
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
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      const sortedBanks = user.banks.sort((a, b) => {
        if (a.isDefault === b.isDefault) return 0;
        return a.isDefault ? -1 : 1;
      });

      res.json({ banks: sortedBanks });
    } catch (error) {
      console.error("Error in getBanks:", error);
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

      // Kiểm tra người dùng tồn tại
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      console.log("Banks before deletion:", user.banks);

      const bankIndex = user.banks.findIndex(
        (bank) => bank._id.toString() === bankId
      );

      if (bankIndex === -1) {
        return res.status(404).json({ message: "Ngân hàng không tồn tại" });
      }

      user.banks.splice(bankIndex, 1);

      await user.save();

      console.log("Banks after deletion:", user.banks);

      res.json({ message: "Ngân hàng đã được xóa", banks: user.banks });
    } catch (error) {
      console.error("Error while deleting bank:", error);
      res.status(500).json({ message: "Có lỗi xảy ra", error });
    }
  },

  setDefaultBank: async (req, res) => {
    try {
      const userId = req.user.id;
      const { bankId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      const bank = user.banks.id(bankId);
      if (!bank) {
        return res
          .status(404)
          .json({ message: "Ngân hàng không tồn tại trong danh sách của bạn" });
      }

      user.banks.forEach((b) => (b.isDefault = false));

      bank.isDefault = true;

      await user.save();

      res.status(200).json({
        message: "Ngân hàng mặc định đã được cập nhật",
        defaultBank: bankId,
      });
    } catch (error) {
      console.error("Error in setDefaultBank:", error);
      res.status(500).json({ message: "Có lỗi xảy ra", error });
    }
  },
};

module.exports = BankController;
