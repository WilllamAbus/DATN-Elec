'use strict'

const autionService = require('../../../services/orders/auctions/auction.service')
const SocketService = require('../../../services/serviceSocket');
const Cart = require('../../../model/orders/cart.model');
const auctionControlller = {
   selectCart: async (req, res) => {
      try {
        const userId = req.user.id;
        const { selectAll, items } = req.body;
  
        const cartId = req.params.id;
  
        if (selectAll !== undefined) {
          // Nếu selectAll được gửi, xử lý chọn hoặc bỏ chọn tất cả
          const cart = await Cart.findOne({ user: userId }).populate({
            path: "items.auctions",
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
            path: "items.auctions",
            select: "_id",
          });
  
          if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
          }
  
          items.forEach((item) => {
            const cartItem = cart.items.find(
              (cartItem) =>
                cartItem.auctions._id.toString() === item.productId 
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
  completeAuctionController : async (req, res) => {
  
  
    try {
      
     
      const { timeTrackID, productId } = req.body;
   
     
      
      const updatedAuction = await autionService.completeAuction(productId, timeTrackID);
    
      
      SocketService.emitAuctionComplete(productId, updatedAuction, timeTrackID);
      return res.status(200).json({ 
        success:true,
        status: 201,
        
        message: 'Đấu giá đã hoàn tất thành công.', 
        auction: updatedAuction });
    } catch (error) {
      console.error('Lỗi hoàn tất đấu giá:', error.message);
      return res.status(500).json({ message: `Không thể hoàn tất đấu giá: ${error.message}` });
    }
  },
   createAution : async (req, res) => {
    try {
      const auctionDetails = req.body;
      const auction = await autionService.createAuction(auctionDetails);
  
      return res.status(201).json({
        success: true,
        data: auction,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
},

getAllAuctions: async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { auctions, total } = await autionService.getAll(parseInt(page), parseInt(limit));
    
    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      auctions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},
getAuctionDetailsV2: async (req, res) => {
 

  try {
    const { userId , productId} = req.query;
  

    

    const details = await autionService.getAuctionDetailsV2( userId, productId);

    
    res.status(200).json({
      success:true,
        status: 201,
        data:details
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
getAuctionDetails: async (req, res) => {
 

  try {
    const { userId , productId} = req.query;
  

    

    const details = await autionService.getAuctionDetails( userId, productId);

    
    res.status(200).json({
      success:true,
        status: 201,
        data:details
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
// Get auction by ID
getAuctionById: async (req, res) => {
  try {
    const { auctionId } = req.params;

    
    const auction = await autionService.getById(auctionId);
 
    
    res.status(200).json({
      success: true,
      status: 200,
      data: auction
    });
  } catch (error) {
    console.error("Error in getBidById controller:", error.message);
    res.status(500).json({ message: error.message });
  }
},

// Delete auction by ID
deleteAuction: async (req, res) => {
  try {
    const { auctionId } = req.params;
    const result = await autionService.delete(auctionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

// Soft delete auction by ID
softDeleteAuction: async (req, res) => {
  try {
    const { auctionId } = req.body;
    const result = await autionService.softDelete(auctionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

// Soft delete multiple auctions
softDeleteAuctionsList: async (req, res) => {
  try {
    const query = req.body; // Assumes body contains the query for soft deletion
    const result = await autionService.softDeleteList(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

// Restore auction by ID
restoreAuction: async (req, res) => {
  try {
    const { auctionId } = req.params;
    const result = await autionService.restore(auctionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

// Get all soft-deleted auctions with pagination
getSoftDeletedAuctions: async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const result = await autionService.getSoftDeleted(parseInt(page), parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

searchAuctionsByWinnerName: async (req, res) => {
  try {
    const { name } = req.query;
    const { page = 1, limit = 5 } = req.query;
    const { auctions, total } = await autionService.searchByWinnerName(name, parseInt(page), parseInt(limit));
    
    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      auctions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},
}

module.exports = auctionControlller