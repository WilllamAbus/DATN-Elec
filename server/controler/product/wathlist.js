const WathList = require("../../model/wathlist");
const Product = require("../../model/product.model");
const User = require("../../model/users.model");
const WathListController = {
  addWatchlist: async (req, res) => {
    try {
      const { user, product } = req.body;

      if (!user || !product) {
        return res.status(400).json({
          success: false,
          message: "User và Product là bắt buộc",
        });
      }

      const ErrdUser = await User.findById(user);
      if (!ErrdUser) {
        return res.status(404).json({
          success: false,
          message: "Người dùng không tồn tại",
        });
      }

      const ErrdProduct = await Product.findById(product);
      if (!ErrdProduct) {
        return res.status(404).json({
          success: false,
          message: "Sản phẩm không tồn tại",
        });
      }

      const ErrWatchlist = await WathList.findOne({ user, product });
      if (ErrWatchlist) {
        return res.status(400).json({
          success: false,
          message: "Sản phẩm đã có trong danh sách yêu thích",
        });
      }

      let newWatchlist = new WathList({ user, product });
      await newWatchlist.save();
      newWatchlist = await newWatchlist.populate("product");

      return res.status(200).json({
        success: true,
        message: "Sản phẩm đã được thêm vào danh sách yêu thích",
        data: newWatchlist,
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      return res.status(500).json({
        message: "Có lỗi xảy ra",
        error: error.message,
      });
    }
  },
  getWatchlist: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "ID người dùng không hợp lệ",
        });
      }

      const watchlist = await WathList.find({ user: userId }).populate(
        "product"
      );

      if (!watchlist.length) {
        return res.status(404).json({
          success: false,
          message: "Không có sản phẩm nào trong danh sách yêu thích",
        });
      }

      return res.status(200).json({
        success: true,
        data: watchlist,
      });
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      return res.status(500).json({
        message: "Có lỗi xảy ra",
        error: error.message,
      });
    }
  },
  DeleteWatchlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      if (!userId || !id) {
        return res.status(400).json({
          success: false,
          message:
            "ID người dùng và ID mục trong danh sách yêu thích là bắt buộc",
        });
      }

      const watchlistItem = await WathList.findOne({
        _id: id,
        user: userId,
      });

      if (!watchlistItem) {
        return res.status(404).json({
          success: false,
          message: "Mục trong danh sách yêu thích không tồn tại",
        });
      }

      await watchlistItem.remove();

      return res.status(200).json({
        success: true,
        message: "Sản phẩm đã được xóa khỏi danh sách yêu thích",
      });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      return res.status(500).json({
        message: "Có lỗi xảy ra",
        error: error.message,
      });
    }
  },
};
module.exports = WathListController;
