const deleBidingService = require('../../../services/customService/deleBidding.service')

const deleBiddingController = {
  deleteBidAndCSController: async (req, res) => {
    try {
      // Extracting parameters from the request body
      const { userId, biddingId, serviceRequestId, reason, notes } = req.body;
    
      
      // Validate required fields
      if (!userId || !biddingId || !serviceRequestId) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
      }

      // Handle the auction deletion and service logging
      const result = await deleBidingService.handleAuctionDeletion(userId, biddingId, serviceRequestId, reason, notes);

      // Respond with success and result
      res.status(200).json({ success: true, result });
    } catch (error) {
      // Respond with error message
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = deleBiddingController