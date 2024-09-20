const Product = require("../../model/product_v2");
const Cart = require("../../model/orders/cart.model");
const Inventory = require("../../model/inventory/inventory.model");
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
  //     let cart = await Cart.findOne({ user: userId });

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

  //       if (isNaN(item.quantity) || item.quantity <= 0) {
  //         return res
  //           .status(400)
  //           .json({ message: "Số lượng sản phẩm không hợp lệ" });
  //       }

  //       item.price = product.product_price_unit;
  //       item.totalItemPrice = item.price * item.quantity;

  //       if (isNaN(item.totalItemPrice)) {
  //         item.totalItemPrice = 0;
  //       }

  //       // Tìm mặt hàng trong giỏ hàng
  //       const existingItemIndex = cart.items.findIndex(
  //         (cartItem) => cartItem.product.toString() === item.product
  //       );

  //       if (existingItemIndex >= 0) {
  //         // Cập nhật số lượng và giá trị tổng của mặt hàng đã tồn tại
  //         cart.items[existingItemIndex].quantity += item.quantity;
  //         cart.items[existingItemIndex].totalItemPrice =
  //           cart.items[existingItemIndex].price *
  //           cart.items[existingItemIndex].quantity;
  //       } else {
  //         // Thêm mặt hàng mới vào giỏ hàng
  //         cart.items.push({
  //           product: item.product,
  //           quantity: item.quantity,
  //           price: item.price,
  //           totalItemPrice: item.totalItemPrice,
  //         });
  //       }

  //       // Cập nhật tổng giá giỏ hàng
  //       totalPrice += item.totalItemPrice;
  //     }

  //     // Cập nhật tổng giá của giỏ hàng
  //     cart.totalPrice = totalPrice;
  //     await cart.save();

  //     res.status(201).json(cart);
  //   } catch (error) {
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

  //     // Tìm giỏ hàng theo ID và người dùng
  //     const cart = await Cart.findOne({
  //       _id: mongoose.Types.ObjectId(cartId), // Tìm giỏ hàng theo cartId
  //       user: userId,
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

  //       if (isNaN(item.quantity) || item.quantity <= 0) {
  //         return res
  //           .status(400)
  //           .json({ message: "Số lượng sản phẩm không hợp lệ" });
  //       }

  //       // Tìm mặt hàng trong giỏ hàng
  //       const existingItemIndex = cart.items.findIndex(
  //         (cartItem) => cartItem.product.toString() === item.product
  //       );

  //       if (existingItemIndex >= 0) {
  //         // Cập nhật số lượng của mặt hàng đã tồn tại
  //         cart.items[existingItemIndex].quantity = item.quantity;
  //         cart.items[existingItemIndex].totalItemPrice =
  //           product.product_price_unit * item.quantity;
  //       } else {
  //         // Thêm mặt hàng mới vào giỏ hàng
  //         const cartItem = {
  //           product: item.product,
  //           quantity: item.quantity,
  //           price: product.product_price_unit || 0,
  //           totalItemPrice: (product.product_price_unit || 0) * item.quantity,
  //         };
  //         cart.items.push(cartItem);
  //       }

  //       // Cập nhật tổng giá
  //       totalPrice += cart.items[existingItemIndex]
  //         ? cart.items[existingItemIndex].totalItemPrice
  //         : (product.product_price_unit || 0) * item.quantity;
  //     }

  //     // Cập nhật tổng giá giỏ hàng
  //     cart.totalPrice = totalPrice;
  //     cart.modifieon = Date.now();
  //     await cart.save();

  //     res.status(200).json(cart);
  //   } catch (error) {
  //     console.error(error);
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

        item.price = product.product_price_unit;
        item.totalItemPrice = item.price * item.quantity;

        if (isNaN(item.totalItemPrice)) {
          item.totalItemPrice = 0;
        }

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
            price: item.price,
            totalItemPrice: item.totalItemPrice,
            inventory: inventory._id,
          });
        }

        totalPrice += item.totalItemPrice;
      }

      cart.totalPrice = totalPrice;
      await cart.save();

      res.status(201).json(cart);
    } catch (error) {
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

      ng;
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
      const userId = mongoose.Types.ObjectId(req.user.id);
      const cartId = mongoose.Types.ObjectId(req.params.id); // Chuyển đổi thành ObjectId

      console.log("Cart ID:", cartId);
      console.log("User ID:", userId);

      const carts = await Cart.find({ user: userId });
      console.log("All Carts for User:", carts);

      const cart = await Cart.findOne({
        "items.product": mongoose.Types.ObjectId(req.params.id),
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

      res.status(200).json(cart);
    } catch (error) {
      console.error("Error:", error.message);
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
