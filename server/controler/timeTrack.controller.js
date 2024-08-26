const TimeTrackService = require('../services/timeTrack.service');


const timeTrackController = {
    create: async (req, res) =>{
        try {
          const timeTrack = await TimeTrackService.createTimeTrack(req.body);
          res.status(201).json(timeTrack);
        } catch (error) {
          res.status(500).json({ message: 'Error creating TimeTrack', error });
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
      }
}


module.exports = timeTrackController