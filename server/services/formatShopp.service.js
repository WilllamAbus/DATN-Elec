"use strict";

const _Format = require("../model/formatShopping.model");
const moment = require("moment-timezone");
const formatService = {
  getFormatById: async (id) => {
    return await _Format.findById(id);
  },

  createFormat: async (formatData) => {
    try {
      const { formats } = formatData;

      // Validate input data
      if (!formats) {
        throw new Error("Missing required fields");
      }

      // Ensure cateReady is an array of strings
      const existingFormat = await _Format.findOne({ formats });
      if (existingFormat) {
        return res
          .status(400)
          .json({
            message: `The format "${formats}" already exists. Please use a different format.`,
          });
      }

      // Fetch categories from the database based on names

      const createdAt = moment().tz("Asia/Ho_Chi_Minh").toDate();

      // Create a Format document
      const newFormat = new _Format({
        formats,
        createdAt,
      });

      // Save the Format to the database
      const savedFormat = await newFormat.save();

      return savedFormat;
    } catch (error) {
      console.error("Error creating Format:", error);
      throw error; // Propagate the error to be handled by the controller or middleware
    }
  },
  updateFormat: async (id, data) => {
    try {
      const updatedFormat = await _Format.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updatedFormat) {
        throw new Error("Format not found.");
      }

      return updatedFormat;
    } catch (error) {
      console.error("Error in updateFormat service:", error.message);
      throw new Error(error.message);
    }
  },

  deleteFormat: async (id) => {
    try {
      const deleteFormat = await _Format.findByIdAndDelete(id);
      return deleteFormat;
    } catch (error) {
      console.error("Error in updateFormat service:", error.message);
      throw new Error(error.message);
    }
  },
  getAllFormat: async () => {
    try {
      // Validate page and pageSize parameters
      const formatAll = await _Format.find({ status: { $ne: "deleted" } });
      // Return the list of Formats along with pagination info
      return formatAll;
    } catch (error) {
      console.error("Error fetching Formats:", error);
      throw new Error("Failed to fetch Formats");
    }
  },
  softDeleteFormat: async (id) => {
    try {
      const nowUtc = new Date();

      // Chuyển đổi thời gian UTC về múi giờ Việt Nam
      // Múi giờ Việt Nam là UTC + 7 giờ
      const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
      const now = new Date(nowUtc.getTime() + offset);

      const softDeleteFormat = await _Format.findByIdAndUpdate(
        id,
        { status: "disable", disabledAt: now }, // Lưu thời gian disable
        { new: true }
      );
      return softDeleteFormat;
    } catch (error) {
      console.error(error);
    }
  },
  deletedListFormat: async () => {
    try {
      // Validate page and pageSize parameters
      const deleteListFormat =
        (await _Format.find({ status: "disable" })) || {};

      // Return the list of deleted Formats along with pagination info
      return deleteListFormat;
    } catch (error) {
      console.error("Error fetching deleted Formats:", error);
      throw new Error("Failed to fetch deleted Formats");
    }
  },
  restore: async (id) => {
    try {
      const restore = await _Format.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
      );
      return restore;
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = formatService;
