const Product = require("../../model/product_v2");
const productVariant = require("../../model/product_v2/productVariant");
const Cart = require("../../model/orders/cart.model");
// const Inventory = require("../../model/inventory/inventory.model");
const Interaction = require("../../model/recommendation/interaction.model");
const Voucher = require("../../model/voucher.model");
const User = require("../../model/users.model");
const mongoose = require("mongoose");
const path = require("path");
const { spawn } = require("child_process");

const CartController = {
  // Hàm để tính toán lại totalPrice
  calculateTotalPrice: (items) => {
    return items
      .filter((item) => item.isSelected)
      .reduce((total, item) => {
        return total + (item.totalItemPrice || 0);
      }, 0);
  },

  // createCart: async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const { items } = req.body;

  //     if (!items || !Array.isArray(items) || items.length === 0) {
  //       return res
  //         .status(400)
  //         .json({ message: "Danh sách sản phẩm không hợp lệ" });
  //     }

  //     let cart = await Cart.findOne({ user: userId }).populate({
  //       path: "items",
  //       populate: {
  //         path: "inventory",
  //         model: "Inventory",
  //       },
  //     });

  //     if (!cart) {
  //       cart = new Cart({
  //         user: userId,
  //         items: [],
  //         totalPrice: 0,
  //       });
  //     }

  //     for (const item of items) {
  //       const product = await Product.findById(item.product);
  //       if (!product) {
  //         return res.status(404).json({ message: "Sản phẩm không tồn tại" });
  //       }

  //       if (!item.variantId) {
  //         return res
  //           .status(400)
  //           .json({ message: "Thiếu biến thể sản phẩm trong yêu cầu." });
  //       }

  //       const selectedVariant = await productVariant
  //         .findOne({
  //           _id: item.variantId,
  //           product: item.product,
  //         })
  //         .populate("inventory");

  //       if (!selectedVariant) {
  //         return res.status(404).json({
  //           message: "Biến thể không tồn tại hoặc không thuộc về sản phẩm",
  //         });
  //       }

  //       const inventory =
  //         selectedVariant.inventory && selectedVariant.inventory.length > 0
  //           ? selectedVariant.inventory[0]
  //           : null;

  //       if (!inventory) {
  //         return res
  //           .status(404)
  //           .json({ message: "Thông tin tồn kho không tồn tại" });
  //       }

  //       if (isNaN(item.quantity) || item.quantity <= 0) {
  //         return res
  //           .status(400)
  //           .json({ message: "Số lượng sản phẩm không hợp lệ" });
  //       }

  //       if (inventory.quantityShelf < item.quantity) {
  //         return res
  //           .status(400)
  //           .json({ message: "Số lượng trong kho không đủ" });
  //       }

  //       // Cập nhật giá từ biến thể sản phẩm và tính toán lại totalItemPrice
  //       item.price = selectedVariant.variant_price;
  //       item.totalItemPrice = item.price * item.quantity;

  //       const existingItemIndex = cart.items.findIndex(
  //         (cartItem) =>
  //           cartItem.product.toString() === item.product.toString() &&
  //           cartItem.productVariant &&
  //           item.variantId &&
  //           cartItem.productVariant.toString() === item.variantId.toString()
  //       );

  //       if (existingItemIndex >= 0) {
  //         const existingItem = cart.items[existingItemIndex];
  //         existingItem.quantity += item.quantity;
  //         existingItem.totalItemPrice =
  //           existingItem.price * existingItem.quantity;
  //       } else {
  //         cart.items.push({
  //           product: item.product,
  //           productVariant: item.variantId,
  //           quantity: item.quantity,
  //           price: item.price,
  //           totalItemPrice: item.totalItemPrice,
  //           inventory: inventory._id,
  //         });
  //       }
  //     }

  //     // Tính tổng giá của giỏ hàng sau khi cập nhật tất cả các item
  //     cart.totalPrice = cart.items.reduce(
  //       (price, item) => price * (item.quantity || 0),
  //       0
  //     );

  //     await cart.save();

  //     // Tạo bản ghi tương tác
  //     for (const item of items) {
  //       const newInteraction = new Interaction({
  //         user: userId,
  //         Cart: cart._id,
  //         productVariant: item.variantId,
  //         type: "cart",
  //         score: 1,
  //       });
  //       await newInteraction.save();
  //     }

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

  //     res.status(201).json({ message: "Thêm vào giỏ hàng thành công", cart });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: error.message });
  //   }
  // },
  createCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ message: "Danh sách sản phẩm không hợp lệ" });
      }

      let cart = await Cart.findOne({ user: userId }).populate({
        path: "items",
        populate: {
          path: "inventory",
          model: "Inventory",
        },
      });

      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [],
          totalPrice: 0,
        });
      }

      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        if (!item.variantId) {
          return res
            .status(400)
            .json({ message: "Thiếu biến thể sản phẩm trong yêu cầu." });
        }

        const selectedVariant = await productVariant
          .findOne({
            _id: item.variantId,
            product: item.product,
          })
          .populate("inventory");

        if (!selectedVariant) {
          return res.status(404).json({
            message: "Biến thể không tồn tại hoặc không thuộc về sản phẩm",
          });
        }

        const inventory =
          selectedVariant.inventory && selectedVariant.inventory.length > 0
            ? selectedVariant.inventory[0]
            : null;

        if (!inventory) {
          return res
            .status(404)
            .json({ message: "Thông tin tồn kho không tồn tại" });
        }

        if (isNaN(item.quantity) || item.quantity <= 0) {
          return res
            .status(400)
            .json({ message: "Số lượng sản phẩm không hợp lệ" });
        }

        if (inventory.quantityShelf < item.quantity) {
          return res
            .status(400)
            .json({ message: "Số lượng trong kho không đủ" });
        }

        // Kiểm tra số lượng sản phẩm trong giỏ hàng trước khi thêm
        const existingItemIndex = cart.items.findIndex(
          (cartItem) =>
            cartItem.product.toString() === item.product.toString() &&
            cartItem.productVariant &&
            item.variantId &&
            cartItem.productVariant.toString() === item.variantId.toString()
        );

        let totalQuantityInCart = 0;
        if (existingItemIndex >= 0) {
          const existingItem = cart.items[existingItemIndex];
          totalQuantityInCart = existingItem.quantity + item.quantity;
        } else {
          totalQuantityInCart = item.quantity;
        }

        if (inventory.quantityShelf < totalQuantityInCart) {
          return res.status(400).json({
            message: `Bạn đa thêm số lượng tôi đa trong kho`,
          });
        }

        item.price = selectedVariant.variant_price;
        item.totalItemPrice = item.price * item.quantity;

        if (existingItemIndex >= 0) {
          const existingItem = cart.items[existingItemIndex];
          existingItem.quantity += item.quantity;
          existingItem.totalItemPrice =
            existingItem.price * existingItem.quantity;
        } else {
          cart.items.push({
            product: item.product,
            productVariant: item.variantId,
            quantity: item.quantity,
            price: item.price,
            totalItemPrice: item.totalItemPrice,
            inventory: inventory._id,
          });
        }
      }

      // Tính tổng giá của giỏ hàng sau khi cập nhật tất cả các item
      cart.totalPrice = cart.items.reduce(
        (price, item) => price + item.totalItemPrice,
        0
      );

      await cart.save();

      // Tạo bản ghi tương tác
      for (const item of items) {
        const newInteraction = new Interaction({
          user: userId,
          Cart: cart._id,
          productVariant: item.variantId,
          type: "cart",
          score: 1,
        });
        await newInteraction.save();
      }

      const pythonScriptPath = path.resolve(
        __dirname,
        "../../../Python Client Server/recommendation_service.py"
      );

      console.log("Python Script Path:", pythonScriptPath);

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

      res.status(201).json({ message: "Thêm vào giỏ hàng thành công", cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  applyVoucherToCart: async (req, res) => {
    try {
      const { cartId, voucherId } = req.body;

      // Tìm giỏ hàng và populate thông tin sản phẩm
      const cart = await Cart.findById(cartId).populate("items.product");
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }

      // Tìm voucher bằng mã code
      const voucher = await Voucher.findOne({ code: voucherId });
      if (!voucher) {
        return res.status(404).json({ message: "Voucher không tồn tại" });
      }

      // Kiểm tra thời hạn của voucher
      const currentDate = new Date();
      if (voucher.expiryDate < currentDate) {
        return res.status(400).json({ message: "Voucher đã hết hạn" });
      }

      // Kiểm tra điều kiện áp dụng của voucher
      if (!voucher.isActive) {
        return res.status(400).json({ message: "Voucher không hợp lệ" });
      }

      let discountAmount = 0;
      let isValidCategory = false;

      // Duyệt qua từng sản phẩm trong giỏ hàng để kiểm tra nếu nó thuộc danh mục được chỉ định trong voucher
      for (const item of cart.items) {
        const product = item.product;

        if (product && product.product_type) {
          const isCategoryValid = voucher.cateReady.some(
            (category) =>
              category.category &&
              product.product_type.toString() === category.category.toString()
          );

          if (isCategoryValid) {
            const itemDiscount = item.totalItemPrice - voucher.voucherNum;
            discountAmount += itemDiscount;
            isValidCategory = true;
          }
        }
      }

      if (!isValidCategory) {
        return res
          .status(400)
          .json({ message: "Không hỗ trợ áp dụng sản phẩm này" });
      }

      // Giới hạn chiết khấu không được vượt quá tổng giá trị giỏ hàng
      discountAmount = Math.min(discountAmount, cart.totalPrice);

      // Nếu chiết khấu làm giá trị tổng giảm xuống 0, kiểm tra lại
      const finalPrice = Math.max(cart.totalPrice - discountAmount, 0);

      return res.status(200).json({
        message: "Voucher đã được áp dụng thành công",
        cart,
        discountAmount,
        finalPrice, // Giá trị sau khi trừ chiết khấu
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi áp dụng voucher",
        error: error.message,
      });
    }
  },

  selectCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { selectAll, items } = req.body;

      const cartId = req.params.id;

      if (selectAll !== undefined) {
        // Nếu selectAll được gửi, xử lý chọn hoặc bỏ chọn tất cả
        const cart = await Cart.findOne({ user: userId }).populate({
          path: "items.product",
          select: "_id",
        });

        if (!cart) {
          return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }

        // Cập nhật trạng thái isSelected của tất cả các sản phẩm trong giỏ hàng
        cart.items.forEach((item) => {
          item.isSelected = selectAll;
        });

        // Cập nhật tổng giá trị
        cart.totalPrice = cart.items.reduce((total, item) => {
          return item.isSelected ? total + item.totalItemPrice : total;
        }, 0);

        await cart.save();

        return res.status(200).json({
          message: "Cập nhật trạng thái sản phẩm thành công",
          allItems: cart.items,
          totalPayment: cart.totalPrice,
        });
      }

      // Nếu items được gửi, xử lý chọn từng sản phẩm
      if (items && items.length > 0) {
        const cart = await Cart.findOne({ user: userId }).populate({
          path: "items.product",
          select: "_id",
        });

        if (!cart) {
          return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }

        items.forEach((item) => {
          const cartItem = cart.items.find(
            (cartItem) =>
              cartItem.product._id.toString() === item.productId &&
              cartItem.productVariant.toString() === item.variantId
          );

          if (cartItem) {
            cartItem.isSelected = !cartItem.isSelected;
            cart.totalPrice = cart.items.reduce((total, item) => {
              return item.isSelected ? total + item.totalItemPrice : total;
            }, 0);
          }
        });

        await cart.save();

        return res.status(200).json({
          message: "Cập nhật trạng thái sản phẩm thành công",
          allItems: cart.items,
          totalPayment: cart.totalPrice,
        });
      }

      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  updateCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const cartId = req.params.id;
      const { items } = req.body;

      // Kiểm tra tính hợp lệ của danh sách sản phẩm
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ message: "Danh sách sản phẩm không hợp lệ" });
      }

      // Tìm giỏ hàng theo ID và người dùng
      const cart = await Cart.findOne({ _id: cartId, user: userId }).populate({
        path: "items",
        populate: {
          path: "inventory",
          model: "Inventory",
        },
      });

      // Kiểm tra xem giỏ hàng có tồn tại không
      if (!cart) {
        return res.status(404).json({
          message: "Giỏ hàng không tồn tại hoặc không thuộc người dùng",
        });
      }

      let totalItemPrice = 0; // Biến để lưu tổng của các totalItemPrice

      // Cập nhật các mặt hàng trong giỏ hàng
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        // Kiểm tra xem có biến thể sản phẩm không
        if (!item.variantId) {
          return res
            .status(400)
            .json({ message: "Thiếu biến thể sản phẩm trong yêu cầu." });
        }

        const selectedVariant = await productVariant
          .findOne({
            _id: item.variantId,
            product: item.product,
          })
          .populate("inventory");

        if (!selectedVariant) {
          return res.status(404).json({
            message: "Biến thể không tồn tại hoặc không thuộc về sản phẩm",
          });
        }

        const inventory =
          selectedVariant.inventory && selectedVariant.inventory.length > 0
            ? selectedVariant.inventory[0]
            : null;

        if (!inventory) {
          return res
            .status(404)
            .json({ message: "Thông tin tồn kho không tồn tại" });
        }

        // Kiểm tra số lượng sản phẩm
        if (isNaN(item.quantity) || item.quantity <= 0) {
          return res
            .status(400)
            .json({ message: "Số lượng sản phẩm không hợp lệ" });
        }

        // Kiểm tra số lượng trong kho
        if (inventory.quantityShelf < item.quantity) {
          return res
            .status(400)
            .json({ message: "Số lượng trong kho không đủ" });
        }

        const existingItemIndex = cart.items.findIndex(
          (cartItem) =>
            cartItem.product.toString() === item.product.toString() &&
            cartItem.productVariant.toString() === item.variantId.toString()
        );

        if (existingItemIndex >= 0) {
          // Nếu đã có, cập nhật số lượng và tổng giá trị
          cart.items[existingItemIndex].quantity = item.quantity;
          cart.items[existingItemIndex].totalItemPrice =
            selectedVariant.variant_price * item.quantity; // Cập nhật tổng giá trị sản phẩm từ biến thể
        } else {
          // Nếu chưa có, thêm sản phẩm vào giỏ hàng
          const cartItem = {
            product: item.product,
            productVariant: item.variantId,
            quantity: item.quantity,
            price: selectedVariant.variant_price || 0, // Lấy giá từ biến thể
            totalItemPrice:
              (selectedVariant.variant_price || 0) * item.quantity,
            inventory: inventory._id,
          };
          cart.items.push(cartItem);
        }

        // Cộng tổng giá của item vào biến totalItemPrice
        totalItemPrice += selectedVariant.variant_price * item.quantity;
      }

      // Cập nhật tổng giá trị giỏ hàng bằng tổng của các totalItemPrice
      cart.totalPrice = totalItemPrice;
      cart.modifiedOn = Date.now(); // Sửa lỗi tên thuộc tính từ `modifieon` thành `modifiedOn`
      await cart.save();

      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // getCarts: async (req, res) => {
  //   try {
  //     let carts = await Cart.find({ user: req.user.id })

  //       .populate({
  //         path: "items.product",
  //       })
  //       .populate({
  //         path: "items.productVariant",
  //         model: "productVariant",
  //         populate: [
  //           { path: "image", model: "ImageVariant" },
  //           { path: "battery", model: "Battery" },
  //           { path: "color", model: "Color" },
  //           { path: "cpu", model: "Cpu" },
  //           { path: "operatingSystem", model: "OperatingSystem" },
  //           { path: "ram", model: "Ram" },
  //           { path: "screen", model: "Screen" },
  //           { path: "storage", model: "Storage" },
  //         ],
  //       })
  //       .populate({
  //         path: "items.inventory",
  //         model: "Inventory",
  //       })
  //       .populate({
  //         path: "itemAuction.auctionWiner",
  //         model: "AuctionWinner",
  //       })
  //       .populate({
  //         path: "itemAuction.inventory",
  //         model: "Inventory",
  //       })

  //       .populate({
  //         path: "itemAuction.auctionPricingRange",
  //         model: "AuctionPricingRange",
  //         populate: {
  //           path: "product_randBib",
  //           model: "productAuction",
  //         },
  //       })
  //       .populate({
  //         path: "itemAuction.auctionRound",
  //         model: "AuctionRound",
  //       });

  //     // Lọc các item hợp lệ
  //     carts = carts.map((cart) => {
  //       cart.items = cart.items.filter(
  //         (item) => item.product !== null || item.auctionWiner !== null
  //       );
  //       return cart;
  //     });

  //     // Cập nhật lại giỏ hàng
  //     await Promise.all(
  //       carts.map((cart) =>
  //         Cart.findByIdAndUpdate(cart._id, {
  //           items: cart.items,
  //           itemAuction: cart.itemAuction,
  //         })
  //       )
  //     );

  //     res.status(201).json({ message: "Lấy danh sách thành công", carts });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },
  // Hàm loại bỏ sản phẩm khỏi giỏ hàng (chỉ áp dụng cho itemAuction)
  // removeItemFromCart: async (cartId, itemId) => {
  //   try {
  //     // Loại bỏ sản phẩm khỏi giỏ hàng theo itemId trong itemAuction
  //     await Cart.updateOne(
  //       { _id: cartId },
  //       { $pull: { itemAuction: { _id: itemId } } }
  //     );
  //   } catch (error) {
  //     console.error("Lỗi khi loại bỏ sản phẩm khỏi giỏ hàng: ", error);
  //   }
  // },
  removeItemFromCart: async (cartId, itemId) => {
    try {
      // Loại bỏ sản phẩm khỏi itemAuction theo itemId
      const result = await Cart.updateOne(
        { _id: cartId },
        { $pull: { itemAuction: { _id: itemId } } }
      );

      // Kiểm tra nếu itemAuction đã rỗng, thì xóa toàn bộ itemAuction khỏi giỏ hàng
      const cart = await Cart.findById(cartId);
      if (cart.itemAuction.length === 0) {
        // Xóa hẳn trường itemAuction nếu không còn sản phẩm đấu giá nào
        await Cart.updateOne(
          { _id: cartId },
          { $unset: { itemAuction: "" } } // Xóa hoàn toàn trường itemAuction
        );
        console.log("Đã xóa trường itemAuction khỏi giỏ hàng.");
      }

      console.log(
        `Sản phẩm ${itemId} đã được loại bỏ khỏi giỏ hàng ${cartId}.`
      );
    } catch (error) {
      console.error("Lỗi khi loại bỏ sản phẩm khỏi giỏ hàng: ", error);
    }
  },

  // Định nghĩa hàm xử lý cảnh báo người dùng
  handleUserWarning: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        if (isNaN(user.warning)) user.warning = 0;

        if (user.warning >= 3) {
          user.statusAuction = "disable";
          user.noteWarning = "Người dùng bị hạn chế đấu giá";
        } else {
          user.warning += 1;
          user.lastWarningAt = new Date(); // Thời điểm cảnh báo gần nhất
        }

        await user.save();
      }
    } catch (error) {
      console.error("Lỗi khi xử lý cảnh báo người dùng:", error);
    }
  },

  getCarts: async (req, res) => {
    try {
      let carts = await Cart.find({ user: req.user.id })
        .populate({
          path: "items.product",
        })
        .populate({
          path: "items.productVariant",
          model: "productVariant",
          populate: [
            { path: "image", model: "ImageVariant" },
            { path: "battery", model: "Battery" },
            { path: "color", model: "Color" },
            { path: "cpu", model: "Cpu" },
            { path: "operatingSystem", model: "OperatingSystem" },
            { path: "ram", model: "Ram" },
            { path: "screen", model: "Screen" },
            { path: "storage", model: "Storage" },
          ],
        })
        .populate({
          path: "items.inventory",
          model: "Inventory",
        })
        .populate({
          path: "itemAuction.auctionWinner",
          model: "AuctionWinner",
          populate: {
            path: "user",
            model: "users",
          },
        })
        .populate({
          path: "itemAuction.inventory",
          model: "Inventory",
        })
        .populate({
          path: "itemAuction.auctionPricingRange",
          model: "AuctionPricingRange",
          populate: {
            path: "product_randBib",
            model: "productAuction",
          },
        })

        .populate({
          path: "itemAuction.auctionRound",
          model: "AuctionRound",
        });

      res.status(201).json({ message: "Lấy danh sách thành công", carts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCartById: async (req, res) => {
    try {
      const userId = req.user.id;
      const cartId = req.params.id;

      console.log("Cart ID:", cartId);
      console.log("User ID:", userId);

      // Kiểm tra tính hợp lệ của cartId và userId
      if (!userId || !cartId) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      // Tìm giỏ hàng theo cartId và userId
      const cart = await Cart.findOne({
        _id: cartId,
        user: userId,
      })
        .populate({
          path: "items.product",
        })
        .populate({
          path: "items.productVariant",
          model: "productVariant",
          populate: [
            { path: "image", model: "ImageVariant" },
            { path: "battery", model: "Battery" },
            { path: "color", model: "Color" },
            { path: "cpu", model: "Cpu" },
            { path: "operatingSystem", model: "OperatingSystem" },
            { path: "ram", model: "Ram" },
            { path: "screen", model: "Screen" },
            { path: "storage", model: "Storage" },
          ],
        })
        .populate({
          path: "items.inventory",
          model: "Inventory",
        })
        .populate({
          path: "itemAuction.auctionWinner",
          model: "AuctionWinner",
          populate: {
            path: "user",
            model: "users",
          },
        })
        .populate({
          path: "itemAuction.inventory",
          model: "Inventory",
        })
        .populate({
          path: "itemAuction.auctionPricingRange",
          model: "AuctionPricingRange",
          populate: {
            path: "product_randBib",
            model: "productAuction",
          },
        })
        .populate({
          path: "itemAuction.auctionRound",
          model: "AuctionRound",
        });

      console.log("Found Cart:", cart);

      if (!cart) {
        return res.status(404).json({
          message: "Giỏ hàng không tồn tại hoặc không thuộc người dùng",
        });
      }

      // Trả về toàn bộ giỏ hàng mà không lọc theo `isSelected`
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error:", error.stack);
      res.status(500).json({ message: error.message });
    }
  },

  deleteCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const cartId = req.params.cartId;
      const productId = req.params.productId;
      const productVariantId = req.params.productVariantId;

      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ _id: cartId, user: userId });

      if (!cart) {
        return res.status(404).json({
          message: "Giỏ hàng không tồn tại hoặc không thuộc người dùng",
        });
      }

      if (productId && productVariantId) {
        // Lọc sản phẩm theo productId và productVariantId
        const updatedItems = cart.items.filter(
          (item) =>
            item.product.toString() !== productId ||
            item.productVariant.toString() !== productVariantId
        );

        if (updatedItems.length === cart.items.length) {
          return res.status(404).json({
            message: "Sản phẩm và biến thể không tồn tại trong giỏ hàng",
          });
        }

        cart.items = updatedItems;

        cart.totalPrice = cart.items.reduce(
          (total, item) => total + item.totalItemPrice,
          0
        );

        await cart.save();

        return res.status(200).json({
          message: "Sản phẩm và biến thể đã được xóa khỏi giỏ hàng",
          cart,
        });
      } else if (productId) {
        // Nếu chỉ có productId, xóa tất cả sản phẩm có productId đó
        const updatedItems = cart.items.filter(
          (item) => item.product.toString() !== productId
        );

        if (updatedItems.length === cart.items.length) {
          return res
            .status(404)
            .json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
        }

        cart.items = updatedItems;

        cart.totalPrice = cart.items.reduce(
          (total, item) => total + item.totalItemPrice,
          0
        );

        await cart.save();

        return res
          .status(200)
          .json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng", cart });
      } else {
        // Nếu không có productId, xóa toàn bộ giỏ hàng
        await Cart.findOneAndDelete({ _id: cartId, user: userId });

        return res
          .status(200)
          .json({ message: "Giỏ hàng đã được xóa thành công" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = CartController;
