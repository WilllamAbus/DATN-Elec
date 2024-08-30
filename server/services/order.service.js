const _Order = require("../model/order.model");
const { sendMail } = require("../config/nodemailler");

const orderService = {
  createOrder: async (orderData) => {
    try {
      if (!orderData) {
        throw new Error("No order data provided");
      }

      // Log the incoming order data for debugging
      //    console.log('In comming data: ', orderData);

      // Validate quantityShopping field
      if (
        typeof orderData.quantityShopping === "undefined" ||
        orderData.quantityShopping === null
      ) {
        throw new Error("Missing quantityShopping field");
      }

      const newOrder = new _Order({
        payment: {
          method: orderData.payment.method,
          details: orderData.payment.details,
        },
        quantityShopping: orderData.quantityShopping,
        totalPrice: orderData.totalPrice,
        userId: orderData.userId.map((user) => ({
          user: user.user, // Ensure _id is passed from the front-end
          email: user.email,
        })),
        products: orderData.products.map((product) => ({
          product: product.product, // Ensure _id is passed from the front-end
          name: product.name,
        })),
        shipping: {
          name: orderData.shipping.name,
          address: orderData.shipping.address,
          city: orderData.shipping.city,
          sdt: orderData.shipping.sdt,
          formatShipping: {
            type: orderData.shipping.formatShipping.type,
            price: orderData.shipping.formatShipping.price,
          },
        },
        status: orderData.status || "active",
      });

      const savedOrder = await newOrder.save();

      const userEmail = orderData.userId[0].email;
      const orderDetails = {
        products: orderData.products.map((product) => ({
          name: product.name,
        })),
        totalPrice: orderData.totalPrice,
        shipping: orderData.shipping,
        quantityShopping: orderData.quantityShopping,
      };
      await sendMail(userEmail, orderDetails);

      return savedOrder;
    } catch (error) {
      console.error("Error in createOrder service:", error);
      throw new Error("Error creating order: " + error.message);
    }
  },

  getOrderById: async (id) => {
    try {
      return await _Order.findById(id);
    } catch (error) {
      console.error("Error getting order by id:", error);
      throw new Error("Failed to get order");
    }
  },

  deleOrder: async (id) => {
    try {
      return await _Order.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
    }
  },

  getAllOrder: async (req, res) => {
    try {
      const orders = await _Order.find({ status: { $ne: "disable" } });
      return orders;
    } catch (error) {
      throw new Error("Error retrieving orders: " + error.message);
    }
  },
  softDeleteOrder: async (id) => {
    try {
      const order = await _Order.findByIdAndUpdate(
        id,
        { status: "disable" },
        { new: true }
      );
      if (!order) {
        console.error("Order not found with ID:", id);
      }
      return order;
    } catch (error) {
      console.error("Error in softDeleteOrder service:", error);
      throw error; // Re-throw the error to be caught by the controller
    }
  },
  deletedList: async (req, res) => {
    try {
      return (await _Order.find({ status: "disable" })) || [];
    } catch (error) {
      console.error(error);
    }
  },
  restore: async (id) => {
    try {
      return await _Order.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
      );
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = orderService;
