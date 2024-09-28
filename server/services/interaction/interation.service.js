"use strict";
const Interaction = require("../../model/recommendation/interaction.model");
const Product_v2 = require("../../model/product_v2"); // Import product model

const interactionService = {
  getPurchasedProducts: async (userId) => {
    try {
      // Tìm các tương tác của người dùng với loại tương tác là 'purchase'
      const interactions = await Interaction.find({
        user: userId,
        type: "purchase",
        isActive: true,
      }).exec();

      // Lấy danh sách productIDs từ các tương tác
      const productIDs = interactions.map(
        (interaction) => interaction.productID
      );

      // Tìm thông tin sản phẩm dựa trên các productIDs
      const products = await Product_v2.find({
        _id: { $in: productIDs },
      }).exec();

      // Tạo danh sách sản phẩm từ thông tin sản phẩm
      const productDetails = products.map((product) => ({
        images: product.image, // Assuming 'image' is an array of image URLs
        name: product.name,
        price: product.product_price_unit,
        product_discount: product.product_discount.discountPercent, // Assuming 'product_price_unit' is the field for product price
      }));

      return productDetails;
    } catch (error) {
      throw new Error(`Error retrieving purchased products: ${error.message}`);
    }
  },
  getAllInteractions: async (page = 1, limit = 10) => {
    try {
      // Tính toán các thông số phân trang
      const skip = (page - 1) * limit;
      const interactions = await Interaction.find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ modifieon: -1 }) // Sắp xếp theo thời gian gần nhất
        .exec();

      const total = await Interaction.countDocuments({ isActive: true }).exec(); // Tổng số bản ghi

      return {
        total,
        page,
        limit,
        interactions,
      };
    } catch (error) {
      throw new Error(`Error retrieving interactions: ${error.message}`);
    }
  },
  getInteractionById: async (id) => {
    try {
      const interaction = await Interaction.findById(id).exec();
      if (!interaction) {
        throw new Error("Interaction not found");
      }
      return interaction;
    } catch (error) {
      throw new Error(`Error retrieving interaction: ${error.message}`);
    }
  },

  softDeleteInteraction: async (id) => {
    try {
      const nowUtc = new Date();
      const offset = 7 * 60 * 60 * 1000; // Chuyển đổi thời gian UTC sang múi giờ Việt Nam (UTC + 7)
      const now = new Date(nowUtc.getTime() + offset);

      const interaction = await Interaction.findByIdAndUpdate(
        id,
        { isActive: false, disabledAt: now },
        { new: true }
      ).exec();

      if (!interaction) {
        throw new Error("Interaction not found");
      }

      return interaction;
    } catch (error) {
      throw new Error(`Error soft deleting interaction: ${error.message}`);
    }
  },

  restoreInteraction: async (id) => {
    try {
      const interaction = await Interaction.findByIdAndUpdate(
        id,
        { isActive: true, disabledAt: null },
        { new: true }
      ).exec();

      if (!interaction) {
        throw new Error("Interaction not found");
      }

      return interaction;
    } catch (error) {
      throw new Error(`Error restoring interaction: ${error.message}`);
    }
  },
  getDeletedInteractions: async (page = 1, limit = 10) => {
    try {
      // Tính toán các thông số phân trang
      const skip = (page - 1) * limit;
      const interactions = await Interaction.find({ isActive: false })
        .skip(skip)
        .limit(limit)
        .sort({ modifieon: -1 }) // Sắp xếp theo thời gian gần nhất
        .exec();

      const total = await Interaction.countDocuments({
        isActive: false,
      }).exec(); // Tổng số bản ghi

      return {
        total,
        page,
        limit,
        interactions,
      };
    } catch (error) {
      throw new Error(
        `Error retrieving deleted interactions: ${error.message}`
      );
    }
  },
};

module.exports = interactionService;
