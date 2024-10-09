const Product = require("../../model/product_v2");
const Cart = require("../../model/orders/cart.model");
const Inventory = require("../../model/inventory/inventory.model");
const Interaction = require("../../model/recommendation/interaction.model");
const Voucher = require("../../model/voucher.model");
const mongoose = require("mongoose");

const CartController = {
  // createCart: async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const { items } = req.body;
  //     let totalPrice = 0;

  //     if (!items || !Array.isArray(items) || items.length === 0) {
  //       return res
  //         .status(400)
  //         .json({ message: "Danh sách sản phẩm không hợp lệ" });
  //     }

  //     // Tìm giỏ hàng theo người dùng
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

  //       const inventory = await Inventory.findOne({ product: item.product });
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

  //       item.price = product.product_price_unit;
  //       item.totalItemPrice = item.price * item.quantity;

  //       if (isNaN(item.totalItemPrice)) {
  //         item.totalItemPrice = 0;
  //       }

  //       const existingItemIndex = cart.items.findIndex(
  //         (cartItem) => cartItem.product.toString() === item.product
  //       );

  //       if (existingItemIndex >= 0) {
  //         cart.items[existingItemIndex].quantity += item.quantity;
  //         cart.items[existingItemIndex].totalItemPrice =
  //           cart.items[existingItemIndex].price *
  //           cart.items[existingItemIndex].quantity;
  //       } else {
  //         cart.items.push({
  //           product: item.product,
  //           quantity: item.quantity,
  //           price: item.price,
  //           totalItemPrice: item.totalItemPrice,
  //           inventory: inventory._id,
  //         });
  //       }

  //       totalPrice += item.totalItemPrice;
  //     }

  //     cart.totalPrice = totalPrice;
  //     await cart.save();

  //     for (const item of items) {
  //       const newInteraction = new Interaction({
  //         user: userId,
  //         Cart: cart._id,
  //         productID: item.product,
  //         type: "cart",
  //         score: 1,
  //       });

  //       await newInteraction.save();
  //     }

  //     res.status(201).json(cart);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },
  // Hàm để tính toán lại totalPrice
  // Hàm để tính toán lại totalPrice
  calculateTotalPrice: (items) => {
    return items
      .filter((item) => item.isSelected) // Lọc chỉ các item có isSelected là true
      .reduce((total, item) => {
        return total + (item.totalItemPrice || 0);
      }, 0);
  },

  createCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { items } = req.body;

      // Kiểm tra tính hợp lệ của danh sách sản phẩm
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ message: "Danh sách sản phẩm không hợp lệ" });
      }

      // Tìm giỏ hàng theo người dùng
      let cart = await Cart.findOne({ user: userId }).populate({
        path: "items",
        populate: {
          path: "inventory",
          model: "Inventory",
        },
      });

      // Nếu không có giỏ hàng, tạo một giỏ hàng mới
      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [],
          totalPrice: 0,
        });
      }

      // Duyệt qua từng sản phẩm trong danh sách
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        const inventory = await Inventory.findOne({ product: item.product });
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

        // Tính giá trị của sản phẩm
        item.price = product.product_price_unit;
        item.totalItemPrice = item.price * item.quantity;

        // Đảm bảo totalItemPrice hợp lệ
        if (isNaN(item.totalItemPrice)) {
          item.totalItemPrice = 0;
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
        const existingItemIndex = cart.items.findIndex(
          (cartItem) => cartItem.product.toString() === item.product
        );

        if (existingItemIndex >= 0) {
          // Nếu đã có, cập nhật số lượng và tổng giá trị
          const existingItem = cart.items[existingItemIndex];
          existingItem.quantity += item.quantity; // Cập nhật số lượng
          existingItem.totalItemPrice =
            existingItem.price * existingItem.quantity; // Cập nhật tổng giá trị sản phẩm
        } else {
          // Nếu chưa có, thêm sản phẩm vào giỏ hàng
          cart.items.push({
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            totalItemPrice: item.totalItemPrice,
            inventory: inventory._id,
          });
        }
      }

      // Cập nhật totalPrice của giỏ hàng
      cart.totalPrice = CartController.calculateTotalPrice(cart.items); // Gọi hàm để tính toán lại totalPrice

      // Log giá trị để kiểm tra
      console.log("Total Price:", cart.totalPrice);
      console.log("Cart Items:", cart.items);

      await cart.save();

      // Ghi lại các tương tác mới
      for (const item of items) {
        const newInteraction = new Interaction({
          user: userId,
          Cart: cart._id,
          productID: item.product,
          type: "cart",
          score: 1,
        });

        await newInteraction.save();
      }

      // Trả về giỏ hàng đã được cập nhật
      res.status(201).json(cart);
    } catch (error) {
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

      // Đảm bảo voucherIds là một mảng
      if (!cart.voucherIds) {
        cart.voucherIds = [];
      }

      let discountAmount = 0;
      let isValidCategory = false; // Biến để kiểm tra nếu có ít nhất một sản phẩm hợp lệ

      // Duyệt qua từng sản phẩm trong giỏ hàng để kiểm tra nếu nó thuộc danh mục được chỉ định trong voucher
      for (const item of cart.items) {
        const product = item.product;

        // Kiểm tra nếu product và product.category tồn tại
        if (product && product.product_type) {
          // Kiểm tra nếu danh mục sản phẩm trùng khớp với danh mục trong voucher
          const isCategoryValid = voucher.cateReady.some(
            (category) =>
              category.category &&
              product.product_type.toString() === category.category.toString()
          );

          if (isCategoryValid) {
            // Nếu sản phẩm thuộc danh mục được áp dụng, tính chiết khấu
            const itemDiscount =
              (item.totalItemPrice * voucher.voucherNum) / 100; // Giả sử voucherNum là phần trăm giảm giá
            discountAmount += itemDiscount;
            isValidCategory = true; // Đánh dấu có ít nhất một sản phẩm hợp lệ
          }
        }
      }

      // Kiểm tra xem có sản phẩm nào hợp lệ không
      if (!isValidCategory) {
        return res
          .status(400)
          .json({ message: "Không hỗ trợ áp dụng sản phẩm này" });
      }

      // Giới hạn chiết khấu không vượt quá tổng giá trị giỏ hàng
      if (discountAmount > cart.totalPrice) {
        discountAmount = cart.totalPrice;
      }

      // Cập nhật thông tin voucher trong giỏ hàng
      cart.voucherIds.push(voucher._id);
      cart.totalPrice -= discountAmount;

      // Đảm bảo tổng tiền không nhỏ hơn 0
      if (cart.totalPrice < 0) {
        cart.totalPrice = 0;
      }

      await cart.save();

      res.status(200).json({
        message: "Voucher đã được áp dụng thành công",
        cart,
        discountAmount,
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
      const { items } = req.body;

      console.log("Request Body:", req.body);
      console.log("User ID:", userId);

      const cartId = req.params.id;
      console.log("Cart ID:", cartId);

      if (!items || items.length === 0) {
        return res
          .status(400)
          .json({ message: "Không có sản phẩm nào được cập nhật" });
      }

      const cart = await Cart.findOne({ user: userId }).populate({
        path: "items.product",
      });

      if (!cart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }

      // Cập nhật trạng thái isSelected cho từng sản phẩm
      items.forEach((item) => {
        const cartItem = cart.items.find(
          (cartItem) => cartItem.product._id.toString() === item.productId
        );

        if (cartItem) {
          // Nếu sản phẩm đã tồn tại trong giỏ hàng, toggle trạng thái isSelected
          const wasSelected = cartItem.isSelected; // Lưu trạng thái trước
          cartItem.isSelected = !wasSelected; // Chuyển đổi trạng thái

          // Cập nhật tổng giá trị giỏ hàng
          if (cartItem.isSelected) {
            // Nếu mới được chọn, cộng vào tổng giá trị
            cart.totalPrice += cartItem.totalItemPrice;
          } else {
            // Nếu vừa bỏ chọn, trừ khỏi tổng giá trị
            cart.totalPrice -= cartItem.totalItemPrice;
          }
        } else {
          console.warn(
            `Sản phẩm với ID ${item.productId} không tồn tại trong giỏ hàng.`
          );
        }
      });

      // Lưu giỏ hàng
      await cart.save();

      const allItems = cart.items;

      res.status(200).json({
        message: "Cập nhật trạng thái sản phẩm thành công",
        allItems,
        totalPayment: cart.totalPrice, // Trả về tổng giá trị hiện tại
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // selectCart: async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const { items } = req.body;

  //     console.log("Request Body:", req.body);
  //     console.log("User ID:", userId);

  //     const cartId = req.params.id;
  //     console.log("Cart ID:", cartId);

  //     if (!items || items.length === 0) {
  //       return res
  //         .status(400)
  //         .json({ message: "Không có sản phẩm nào được cập nhật" });
  //     }

  //     const cart = await Cart.findOne({ user: userId }).populate({
  //       path: "items.product",
  //     });

  //     if (!cart) {
  //       return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  //     }

  //     // Cập nhật trạng thái isSelected cho từng sản phẩm
  //     items.forEach((item) => {
  //       const cartItem = cart.items.find(
  //         (cartItem) => cartItem.product._id.toString() === item.productId
  //       );

  //       if (cartItem) {
  //         // Nếu sản phẩm đã tồn tại trong giỏ hàng, toggle trạng thái isSelected
  //         cartItem.isSelected = !cartItem.isSelected; // Chuyển đổi trạng thái
  //       } else {
  //         console.warn(
  //           `Sản phẩm với ID ${item.productId} không tồn tại trong giỏ hàng.`
  //         );
  //       }
  //     });

  //     // Lưu giỏ hàng
  //     await cart.save();

  //     const allItems = cart.items;

  //     const totalPayment = allItems.reduce(
  //       (total, item) =>
  //         item.isSelected ? total + item.totalItemPrice : total,
  //       0
  //     );

  //     res.status(200).json({
  //       message: "Cập nhật trạng thái sản phẩm thành công",
  //       allItems,
  //       totalPayment,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: error.message });
  //   }
  // },

  // updateCart: async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const cartId = req.params.id;
  //     const { items } = req.body;
  //     let totalPrice = 0;

  //     if (!items || !Array.isArray(items) || items.length === 0) {
  //       return res
  //         .status(400)
  //         .json({ message: "Danh sách sản phẩm không hợp lệ" });
  //     }

  //     const cart = await Cart.findOne({ _id: cartId, user: userId }).populate({
  //       path: "items",
  //       populate: {
  //         path: "inventory",
  //         model: "Inventory",
  //       },
  //     });

  //     if (!cart) {
  //       return res.status(404).json({
  //         message: "Giỏ hàng không tồn tại hoặc không thuộc người dùng",
  //       });
  //     }

  //     // Cập nhật các mặt hàng trong giỏ hàng
  //     for (const item of items) {
  //       const product = await Product.findById(item.product);
  //       if (!product) {
  //         return res.status(404).json({ message: "Sản phẩm không tồn tại" });
  //       }

  //       const inventory = await Inventory.findOne({ product: item.product });
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

  //       const existingItemIndex = cart.items.findIndex(
  //         (cartItem) => cartItem.product.toString() === item.product
  //       );

  //       if (existingItemIndex >= 0) {
  //         cart.items[existingItemIndex].quantity = item.quantity;
  //         cart.items[existingItemIndex].totalItemPrice =
  //           product.product_price_unit * item.quantity;
  //       } else {
  //         const cartItem = {
  //           product: item.product,
  //           quantity: item.quantity,
  //           price: product.product_price_unit || 0,
  //           totalItemPrice: (product.product_price_unit || 0) * item.quantity,
  //           inventory: inventory._id,
  //         };
  //         cart.items.push(cartItem);
  //       }

  //       totalPrice += cart.items[existingItemIndex]
  //         ? cart.items[existingItemIndex].totalItemPrice
  //         : (product.product_price_unit || 0) * item.quantity;
  //     }

  //     cart.totalPrice = totalPrice;
  //     cart.modifiedOn = Date.now(); // Sửa lỗi tên thuộc tính từ `modifieon` thành `modifiedOn`
  //     await cart.save();

  //     res.status(200).json(cart);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: error.message });
  //   }
  // },
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

      // Cập nhật các mặt hàng trong giỏ hàng
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        const inventory = await Inventory.findOne({ product: item.product });
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
          (cartItem) => cartItem.product.toString() === item.product
        );

        if (existingItemIndex >= 0) {
          // Nếu đã có, cập nhật số lượng và tổng giá trị
          cart.items[existingItemIndex].quantity = item.quantity;
          cart.items[existingItemIndex].totalItemPrice =
            product.product_price_unit * item.quantity; // Cập nhật tổng giá trị sản phẩm
        } else {
          // Nếu chưa có, thêm sản phẩm vào giỏ hàng
          const cartItem = {
            product: item.product,
            quantity: item.quantity,
            price: product.product_price_unit || 0,
            totalItemPrice: (product.product_price_unit || 0) * item.quantity,
            inventory: inventory._id,
          };
          cart.items.push(cartItem);
        }
      }

      // Tính toán tổng giá trị giỏ hàng bằng hàm calculateTotalPrice
      cart.totalPrice = CartController.calculateTotalPrice(cart.items);
      cart.modifiedOn = Date.now(); // Sửa lỗi tên thuộc tính từ `modifieon` thành `modifiedOn`
      await cart.save();

      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  getCarts: async (req, res) => {
    try {
      let carts = await Cart.find({ user: req.user.id })
        .populate({
          path: "user",
          select: "name address phone email",
        })
        .populate({
          path: "items.product",
        })
        .populate({
          path: "items",
          populate: {
            path: "inventory",
            model: "Inventory",
          },
        });

      carts = carts.map((cart) => {
        cart.items = cart.items.filter((item) => item.product !== null);
        return cart;
      });

      await Promise.all(
        carts.map((cart) =>
          Cart.findByIdAndUpdate(cart._id, { items: cart.items })
        )
      );

      res.status(200).json(carts);
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
      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(cartId)
      ) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      const carts = await Cart.find({ user: userId });
      console.log("All Carts for User:", carts);

      // Tìm giỏ hàng theo cartId và userId
      const cart = await Cart.findOne({
        _id: mongoose.Types.ObjectId(cartId),
        user: userId,
      })
        .populate({
          path: "user",
          select: "name address phone email",
        })
        .populate({
          path: "items.product",
        })
        .populate({
          path: "items",
          populate: {
            path: "inventory",
            model: "Inventory",
          },
        });

      console.log("Found Cart:", cart);

      if (!cart) {
        return res.status(404).json({
          message: "Giỏ hàng không tồn tại hoặc không thuộc người dùng",
        });
      }

      // Lọc các mục có `isSelected` là true
      const selectedItems = cart.items.filter(
        (item) => item.isSelected === true
      );

      // Kiểm tra nếu không có sản phẩm nào được chọn
      if (selectedItems.length === 0) {
        return res.status(404).json({
          message: "Không có sản phẩm nào được chọn trong giỏ hàng",
        });
      }

      // Trả về giỏ hàng chỉ với các mục được chọn
      res.status(200).json({
        ...cart.toObject(), // Dùng toObject để chuyển đổi Document thành Object thông thường
        items: selectedItems,
      });
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

      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ _id: cartId, user: userId });

      if (!cart) {
        return res.status(404).json({
          message: "Giỏ hàng không tồn tại hoặc không thuộc người dùng",
        });
      }

      if (productId) {
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
