const Product = require("../../model/product_v2");
const Cart = require("../../model/orders/cart.model");
const Inventory = require("../../model/inventory/inventory.model");
const Interaction = require("../../model/recommendation/interaction.model");
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
  createCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { items } = req.body;
      let totalPrice = 0;

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

        const inventory = await Inventory.findOne({ product: item.product });
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

        // Tính toán giá và tổng giá trị sản phẩm
        item.price = product.product_price_unit;
        item.totalItemPrice = item.price * item.quantity;

        totalPrice += item.totalItemPrice;

        const existingItemIndex = cart.items.findIndex(
          (cartItem) => cartItem.product.toString() === item.product
        );

        if (existingItemIndex >= 0) {
          cart.items[existingItemIndex].quantity += item.quantity;
          cart.items[existingItemIndex].totalItemPrice =
            cart.items[existingItemIndex].price *
            cart.items[existingItemIndex].quantity;
        } else {
          cart.items.push({
            product: item.product,
            quantity: item.quantity,
            price: item.price, // Đảm bảo giá được gán
            totalItemPrice: item.totalItemPrice, // Đảm bảo tổng giá trị được gán
            isSelected: item.isSelected || false, // Thêm isSelected vào từng sản phẩm
            inventory: inventory._id,
          });
        }
      }

      cart.totalPrice = totalPrice;
      await cart.save();

      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
          cartItem.isSelected = !cartItem.isSelected; // Chuyển đổi trạng thái
        } else {
          console.warn(
            `Sản phẩm với ID ${item.productId} không tồn tại trong giỏ hàng.`
          );
        }
      });

      // Lưu giỏ hàng
      await cart.save();

      const allItems = cart.items;

      const totalPayment = allItems.reduce(
        (total, item) =>
          item.isSelected ? total + item.totalItemPrice : total,
        0
      );

      res.status(200).json({
        message: "Cập nhật trạng thái sản phẩm thành công",
        allItems,
        totalPayment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  updateCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const cartId = req.params.id;
      const { items } = req.body;
      let totalPrice = 0;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ message: "Danh sách sản phẩm không hợp lệ" });
      }

      const cart = await Cart.findOne({ _id: cartId, user: userId }).populate({
        path: "items",
        populate: {
          path: "inventory",
          model: "Inventory",
        },
      });

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

        const existingItemIndex = cart.items.findIndex(
          (cartItem) => cartItem.product.toString() === item.product
        );

        if (existingItemIndex >= 0) {
          cart.items[existingItemIndex].quantity = item.quantity;
          cart.items[existingItemIndex].totalItemPrice =
            product.product_price_unit * item.quantity;
        } else {
          const cartItem = {
            product: item.product,
            quantity: item.quantity,
            price: product.product_price_unit || 0,
            totalItemPrice: (product.product_price_unit || 0) * item.quantity,
            inventory: inventory._id,
          };
          cart.items.push(cartItem);
        }

        totalPrice += cart.items[existingItemIndex]
          ? cart.items[existingItemIndex].totalItemPrice
          : (product.product_price_unit || 0) * item.quantity;
      }

      cart.totalPrice = totalPrice;
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
      const carts = await Cart.find({ user: req.user.id })
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
