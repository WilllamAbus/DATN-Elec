'use strict'
const OrderDetailAuction = require('../../../model/orders/auctionsOrders/aucOrderDetail.model');
const Inventory = require('../../../model/inventory/inventory.model');



const detailService = {
    getPaginatedOrderDetails : async (page = 1, limit = 10, includeSoftDeleted = false) => {
        try {
          const skip = (page - 1) * limit;
      
          // Query for order details
          const query = includeSoftDeleted ? {} : { disabledAt: null, status: { $ne: 'disable' } };
      
          // Fetch paginated order details
          const orderDetails = await OrderDetailAuction.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();
      
          // Fetch product details for each order detail
          const orderDetailsWithProductInfo = await Promise.all(orderDetails.map(async (order) => {
            const product = await Inventory.findById(order.productID).select('name images').lean();
            return {
              ...order,
              productName: product ? product.name : 'Unknown',
              productImages: product ? product.images : [],
            };
          }));
      
          // Count total order details
          const totalOrderDetails = await OrderDetailAuction.countDocument({ status: { $ne: 'disable' } });
      
          return {
            orderDetails: orderDetailsWithProductInfo,
            totalOrderDetails,
          };
        } catch (error) {
          console.error(`Error in getPaginatedOrderDetails: ${error.message}`);
          throw new Error(`Error retrieving order details: ${error.message}`);
        }
    },

    softDeleteOrderDetail :   async (orderDetailId) => {
        try {
            const nowUtc = new Date();
    
            // Chuyển đổi thời gian UTC về múi giờ Việt Nam
            // Múi giờ Việt Nam là UTC + 7 giờ
            const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
            const now = new Date(nowUtc.getTime() + offset);
          const result = await OrderDetailAuction.findByIdAndUpdate(
            orderDetailId,
            {  status: 'disable',disabledAt: now },
            { new: true, lean: true }
          );
          return result;
        } catch (error) {
          console.error(`Error in softDeleteOrderDetail: ${error.message}`);
          throw new Error(`Error soft deleting order detail: ${error.message}`);
        }
      },
      
      restoreOrderDetail : async (orderDetailId) => {
        try {
          const result = await OrderDetailAuction.findByIdAndUpdate(
            orderDetailId,
            { disabledAt: null, status: 'active' },
            { new: true, lean: true }
          );
          return result;
        } catch (error) {
          console.error(`Error in restoreOrderDetail: ${error.message}`);
          throw new Error(`Error restoring order detail: ${error.message}`);
        }
      },

      getSoftDeletedOrderDetails : async (page = 1, limit = 5) => {
        try {
          const skip = (page - 1) * limit;
      
          // Fetch paginated soft-deleted order details
          const softDeletedOrderDetails = await OrderDetailAuction.find({ disabledAt: { $ne: null }, status: 'disable' })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();
      
          // Count total soft-deleted order details
          const totalSoftDeletedOrderDetails = await OrderDetailAuction.countDocuments({ disabledAt: { $ne: null }, status: 'disable' });
      
          return {
            softDeletedOrderDetails,
            totalSoftDeletedOrderDetails,
          };
        } catch (error) {
          console.error(`Error in getSoftDeletedOrderDetails: ${error.message}`);
          throw new Error(`Error retrieving soft-deleted order details: ${error.message}`);
        }
    },
    getOrderDetailWithImagesById : async (orderDetailId) => {
        try {
          // Find the order detail by ID
          const orderDetail = await OrderDetailAuction.findById(orderDetailId).lean();
          if (!orderDetail) {
            return null; // Order detail not found
          }
      
          // Get the product images if productID exists
          if (orderDetail.productID) {
            const product = await Inventory.findById(orderDetail.productID).select('images').lean();
            orderDetail.images = product ? product.images : []; // Attach images to order detail
          } else {
            orderDetail.images = []; // No productID, no images
          }
      
          return orderDetail;
        } catch (error) {
          throw new Error(error.message);
        }
    }
      
}

module.exports = detailService