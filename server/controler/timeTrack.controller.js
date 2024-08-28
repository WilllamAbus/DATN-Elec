const TimeTrackService = require('../services/timeTrack.service');


const timeTrackController = {
    create: async (req, res) => {
        try {
          const data = req.body;
          // Tạo một bản ghi TimeTrack mới
          const newTimeTrack = await TimeTrackService.createTimeTrack(data);
          
          // Bắt đầu cập nhật endTime trong thời gian thực sau khi tạo thành công
          TimeTrackService.updateEndTimeInRealTime(newTimeTrack._id);
      
          res.status(201).json(newTimeTrack);
        } catch (error) {
          console.error('Error in createTimeTrack controller:', error);
          res.status(500).json({ message: 'Error creating TimeTrack', error: error.message });
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