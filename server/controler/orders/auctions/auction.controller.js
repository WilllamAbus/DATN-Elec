'use strict'

const autionService = require('../../../services/orders/auctions/auction.service')
const SocketService = require('../../../services/serviceSocket');
const auctionControlller = {
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
getAuctionDetails: async (req, res) => {
 

  try {
    const { auctionId, productId } = req.body;
    // Validate input
    if (!auctionId || !productId) {
      return res.status(400).json({ error: "Auction ID and Product ID are required." });
    }

    // Get auction details from the service
    const details = await autionService.getAuctionDetails(auctionId, productId);
    res.status(200).json(details);
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