const WathList = require("../../model/wathlist");
const Product = require("../../model/product_v2/index");
const productVariant = require("../../model/product_v2/productVariant");
const User = require("../../model/users.model");
const Interaction = require("../../model/recommendation/interaction.model");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const path = require("path");

const WathListController = {
  // addWatchlist: async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const productId = req.params.productId;
  //     const { variantId } = req.body;

  //     if (!userId || !productId) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "User và Product là bắt buộc",
  //       });
  //     }

  //     const foundUser = await User.findById(userId);
  //     if (!foundUser) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Người dùng không tồn tại",
  //       });
  //     }

  //     const foundProduct = await Product.findById(productId);
  //     if (!foundProduct) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Sản phẩm không tồn tại",
  //       });
  //     }

  //     let selectedVariant = null;
  //     if (variantId) {
  //       selectedVariant = await productVariant.findOne({
  //         _id: variantId,
  //         product: productId,
  //       });

  //       if (!selectedVariant) {
  //         return res.status(404).json({
  //           success: false,
  //           message: "Biến thể không tồn tại hoặc không thuộc về sản phẩm",
  //         });
  //       }
  //     }

  //     const existingWatchlist = await WathList.findOne({
  //       user: userId,
  //       product: productId,
  //       productVariant: variantId || null,
  //     });

  //     if (existingWatchlist) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Sản phẩm đã có trong danh sách yêu thích",
  //       });
  //     }

  //     let newWatchlist = new WathList({
  //       user: userId,
  //       product: productId,
  //       productVariant: selectedVariant ? selectedVariant._id : null,
  //     });

  //     await newWatchlist.save();
  //     newWatchlist = await newWatchlist.populate("product productVariant");

  //     // Ghi nhận tương tác
  //     const newInteraction = new Interaction({
  //       user: userId,
  //       Watchlist: newWatchlist._id,
  //       productVariant: variantId || null,
  //       type: "add wishlist",
  //       score: 1,
  //     });
  //     console.log(newInteraction);
  //     await newInteraction.save();
  //     console.log(`Saved interaction for user: ${userId}`);
  //     console.log(`Saved interaction: ${JSON.stringify(newInteraction)}`);

  //     // Đường dẫn tới file Python
  //     const pythonScriptPath = path.resolve(
  //       __dirname,
  //       "../../../Python Client Server/recommendation_service.py"
  //     );

  //     // Gọi script Python để tạo gợi ý sản phẩm
  //     const pythonProcess = spawn("python", [
  //       pythonScriptPath,
  //       userId.toString(),
  //     ]);

  //     // Xử lý kết quả từ script Python
  //     pythonProcess.stdout.on("data", (data) => {
  //       console.log(`Python Output: ${data.toString()}`);
  //     });

  //     pythonProcess.stderr.on("data", (data) => {
  //       console.error(`Python Error: ${data.toString()}`);
  //     });

  //     pythonProcess.on("error", (error) => {
  //       console.error(`Failed to start Python process: ${error.message}`);
  //     });

  //     pythonProcess.on("close", (code) => {
  //       if (code !== 0) {
  //         console.error(`Python script exited with code ${code}`);
  //       } else {
  //         console.log(`Python script finished successfully.`);
  //       }
  //     });

  //     return res.status(200).json({
  //       success: true,
  //       message: "Sản phẩm đã được thêm vào danh sách yêu thích",
  //       data: newWatchlist,
  //     });
  //   } catch (error) {
  //     console.error("Error adding to watchlist:", error);
  //     return res.status(500).json({
  //       message: "Có lỗi xảy ra",
  //       error: error.message,
  //     });
  //   }
  // },
  addWatchlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const variantId = req.params.variantId;

      if (!userId || !variantId) {
        return res.status(400).json({
          success: false,
          message: "User và Variant là bắt buộc",
        });
      }

      // Tìm biến thể sản phẩm
      const selectedVariant = await productVariant
        .findById(variantId)
        .populate("product");
      if (!selectedVariant) {
        return res.status(404).json({
          success: false,
          message: "Biến thể không tồn tại",
        });
      }

      // Lấy productId từ biến thể
      const productId = selectedVariant.product._id;

      // Kiểm tra xem Watchlist đã tồn tại chưa
      const existingWatchlist = await WathList.findOne({
        user: userId,
        product: productId,
        productVariant: variantId,
      });

      if (existingWatchlist) {
        return res.status(400).json({
          success: false,
          message: "Sản phẩm đã có trong danh sách yêu thích",
        });
      }

      // Thêm mới vào Watchlist
      let newWatchlist = new WathList({
        user: userId,
        product: productId,
        productVariant: variantId,
      });

      await newWatchlist.save();
      newWatchlist = await newWatchlist.populate("product productVariant");

      // Ghi nhận tương tác
      const newInteraction = new Interaction({
        user: userId,
        watchlist: newWatchlist._id,
        productVariant: variantId,
        type: "add wishlist",
        score: 1,
      });
      await newInteraction.save();

      const pythonScriptPath = path.resolve(
        __dirname,
        "../../../Python Client Server/recommendation_service.py"
      );

      const pythonProcess = spawn("python", [
        pythonScriptPath,
        userId.toString(),
      ]);

      pythonProcess.stdout.on("data", (data) => {
        console.log(`Python Output: ${data.toString()}`);
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data.toString()}`);
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}`);
        } else {
          console.log(`Python script finished successfully.`);
        }
      });

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

      const watchlist = await WathList.find({ user: userId })
        .populate({
          path: "product",
        })
        .populate({
          path: "productVariant",
          populate: [
            {
              path: "image",
            },
            {
              path: "ram",
            },
            {
              path: "storage",
            },
          ],
        });

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
  //     const { productId, variantId } = req.params;

  //     if (!userId || !productId) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "ID người dùng và ID sản phẩm là bắt buộc",
  //       });
  //     }

  //     if (!mongoose.Types.ObjectId.isValid(productId)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "ID sản phẩm không hợp lệ",
  //       });
  //     }

  //     const query = {
  //       user: userId,
  //       product: productId,
  //       productVariant: variantId || null,
  //     };

  //     const watchlistItem = await WathList.findOneAndDelete(query);

  //     if (!watchlistItem) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Mục trong danh sách yêu thích không tồn tại",
  //       });
  //     }

  //     await Interaction.deleteMany({
  //       user: userId,
  //       productID: productId,
  //       productVariant: variantId || null,
  //       type: "add wishlist",
  //     });

  //     return res.status(200).json({
  //       success: true,
  //       message: "Sản phẩm đã được xóa khỏi danh sách yêu thích",
  //     });
  //   } catch (error) {
  //     console.error("Error removing from watchlist:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Có lỗi xảy ra",
  //       error: error.message,
  //     });
  //   }
  // },
  DeleteWatchlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const { variantId } = req.params; // Lấy variantId từ params

      if (!userId || !variantId) {
        return res.status(400).json({
          success: false,
          message: "ID người dùng và ID biến thể là bắt buộc",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(variantId)) {
        return res.status(400).json({
          success: false,
          message: "ID biến thể không hợp lệ",
        });
      }

      // Tìm và xóa mục từ danh sách yêu thích
      const watchlistItem = await WathList.findOneAndDelete({
        user: userId,
        productVariant: variantId,
      });

      if (!watchlistItem) {
        return res.status(404).json({
          success: false,
          message: "Mục trong danh sách yêu thích không tồn tại",
        });
      }

      // Xóa các tương tác liên quan
      await Interaction.deleteMany({
        user: userId,
        productVariant: variantId,
        type: "add wishlist",
      });

      return res.status(200).json({
        success: true,
        message: "Biến thể đã được xóa khỏi danh sách yêu thích",
      });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra",
        error: error.message,
      });
    }
  },
};
module.exports = WathListController;
