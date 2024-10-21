const WathList = require("../../model/wathlist");
const Product = require("../../model/product_v2/index");
const User = require("../../model/users.model");
const Interaction = require("../../model/recommendation/interaction.model");
const mongoose = require("mongoose");

const WathListController = {
  addWatchlist: async (req, res) => {
    try {
      const userId = req.user.id; // Giả sử bạn đang sử dụng middleware để thêm `user` vào `req`
      const { productId } = req.params;

      if (!userId || !productId) {
        return res.status(400).json({
          success: false,
          message: "User và Product là bắt buộc",
        });
      }

      const foundUser = await User.findById(userId);
      if (!foundUser) {
        return res.status(404).json({
          success: false,
          message: "Người dùng không tồn tại",
        });
      }

      const foundProduct = await Product.findById(productId);
      if (!foundProduct) {
        return res.status(404).json({
          success: false,
          message: "Sản phẩm không tồn tại",
        });
      }

      const existingWatchlist = await WathList.findOne({
        user: userId,
        product: productId,
      });
      if (existingWatchlist) {
        return res.status(400).json({
          success: false,
          message: "Sản phẩm đã có trong danh sách yêu thích",
        });
      }

      let newWatchlist = new WathList({ user: userId, product: productId });
      await newWatchlist.save();
      newWatchlist = await newWatchlist.populate("product");

      const newInteraction = new Interaction({
        user: userId,
        Watchlist: newWatchlist._id,
        productID: productId,
        type: "add wishlist",
        score: 1,
      });

      
      await newInteraction.save();


        // // Gọi script Python với đường dẫn đầy đủ
        // const pythonScriptPath = path.join(__dirname, '../../../Python Client Server/recommendation_service.py');
        
        // exec(`python3 ${pythonScriptPath} ${userId}`, (error, stdout, stderr) => {
        //     if (error) {
        //         console.error(`Error executing Python script: ${error}`);
        //         return res.status(500).json({
        //             success: false,
        //             message: "Lỗi khi tính toán gợi ý sản phẩm",
        //         });
        //     }
        //     if (stderr) {
        //       console.error(`Python script error: ${stderr}`);
        //       return res.status(500).json({
        //           success: false,
        //           message: "Có lỗi từ script Python",
        //       });
        //   }
        //     console.log(`Python script output: ${stdout}`);
        // });

        return res.status(200).json({
            success: true,
            message: "Sản phẩm đã được thêm vào danh sách yêu thích và ghi nhận tương tác",
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
  // DeleteWatchlist: async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const { id } = req.params;
  //     if (!userId || !id) {
  //       return res.status(400).json({
  //         success: false,
  //         message:
  //           "ID người dùng và ID mục trong danh sách yêu thích là bắt buộc",
  //       });
  //     }

  //     const watchlistItem = await WathList.findOne({
  //       _id: id,
  //       user: userId,
  //     });

  //     if (!watchlistItem) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Mục trong danh sách yêu thích không tồn tại",
  //       });
  //     }

  //     await watchlistItem.remove();

  //     return res.status(200).json({
  //       success: true,
  //       message: "Sản phẩm đã được xóa khỏi danh sách yêu thích",
  //     });
  //   } catch (error) {
  //     console.error("Error removing from watchlist:", error);
  //     return res.status(500).json({
  //       message: "Có lỗi xảy ra",
  //       error: error.message,
  //     });
  //   }
  // },
  DeleteWatchlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params; // `id` sẽ là `product._id`

      if (!userId || !productId) {
        return res.status(400).json({
          success: false,
          message: "ID người dùng và ID sản phẩm là bắt buộc",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: "ID sản phẩm không hợp lệ",
        });
      }

      // Tìm và xóa mục trong danh sách yêu thích dựa trên `product._id` và `userId`
      const watchlistItem = await WathList.findOneAndDelete({
        product: productId,
        user: userId,
      });

      if (!watchlistItem) {
        return res.status(404).json({
          success: false,
          message: "Mục trong danh sách yêu thích không tồn tại",
        });
      }

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
