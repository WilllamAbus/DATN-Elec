const TimeTrackService = require('../services/timeTrack.service');


const timeTrackController = {
  create : async (req, res) => {
    try {
      const { productId, endTime } = req.body;
  
      // Validate request body
      if (!productId || !endTime) {
        return res.status(400).json({ message: 'Missing required fields: productId and endTime' });
      }
  
      // Create a new TimeTrack record
      const newTimeTrack = await TimeTrackService.createTimeTrack(productId, { endTime });
  
      // Update endTime in real-time
      // TimeTrackService.updateEndTimeInRealTime(newTimeTrack._id);
  
      // Respond with the created TimeTrack record
      res.status(201).json({
        success:true, 
        status: 200,  
        data:newTimeTrack});
    } catch (error) {
      console.error('Error in createTimeTrack controller:', error);
      res.status(500).json({ message: 'Error creating TimeTrack', error: error.message });
    }
  },
  

      getTimeTractByProductDetails : async (req, res) => {
             
        try {
          const { productId } = req.params;
          console.log('prodctID', productId);
          
          const productDetails = await TimeTrackService.getTimeTrackByProduct( productId);
          return res.status(200).json({ success: true, status: 200,  data: productDetails });
        } catch (error) {
          if (error.message === 'Product not found') {
            return res.status(404).json({ success: false, message: error.message });
          }
          console.error('Error fetching product details:', error);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
      },
      

      getTimeTrackById: async(req, res)=> {
        try {
          const timeTrack = await TimeTrackService.getTimeTrackById(req.params.id);
          if (!timeTrack) {
            return res.status(404).json({ message: 'TimeTrack not found' });
          }
          res.status(200).json(timeTrack);
        } catch (error) {
          res.status(500).json({ message: 'Error retrieving TimeTrack', error });
        }
      },

      getAllTimeTrack: async(req, res)=> {
        try {
          const timeTracks = await TimeTrackService.getAllTimeTracks();
          res.status(200).json(timeTracks);
        } catch (error) {
          res.status(500).json({ message: 'Error retrieving TimeTracks', error });
        }
      },
      update: async(req, res) =>{
        try {
          const timeTrack = await TimeTrackService.updateTimeTrack(req.params.id, req.body);
          if (!timeTrack) {
            return res.status(404).json({ message: 'TimeTrack not found' });
          }
          res.status(200).json(timeTrack);
        } catch (error) {
          res.status(500).json({ message: 'Error updating TimeTrack', error });
        }
      },
      delete: async(req, res) =>{
        try {
          const timeTrack = await TimeTrackService.deleteTimeTrack(req.params.id);
          if (!timeTrack) {
            return res.status(404).json({ message: 'TimeTrack not found' });
          }
          res.status(200).json({ message: 'TimeTrack deleted successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Error deleting TimeTrack', error });
        }
      },

      updateEndTime: async (req, res) => {
        try {
          const { id } = req.params;
          const { endTime } = req.body;
    
          if (!endTime) {
            return res.status(400).json({ message: 'EndTime is required' });
          }
    
          // Cập nhật endTime cho bản ghi TimeTrack
          const updatedTimeTrack = await TimeTrackService.updateTimeTrack(id, { endTime });
    
          if (!updatedTimeTrack) {
            return res.status(404).json({ message: 'TimeTrack not found' });
          }
    
          res.status(200).json(updatedTimeTrack);
        } catch (error) {
          console.error('Error in updateEndTime controller:', error);
          res.status(500).json({ message: 'Error updating endTime', error: error.message });
        }
      }
}


module.exports = timeTrackController