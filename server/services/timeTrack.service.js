const Time_Track = require('../model/time-track.model')


const timeTrackService = {
    createTimeTrack : async(data) => {
        const timeTrack = new Time_Track(data);
        return await timeTrack.save();
      },

      getTimeTrackById: async(id) => {
        return await Time_Track.findById(id);
      },

      getAllTimeTracks :async() => {
        return await Time_Track.find();
      },

      updateTimeTrack: async(id, data) =>{
        return await Time_Track.findByIdAndUpdate(id, data, { new: true });
      },

      deleteTimeTrack: async(id) => {
        return await Time_Track.findByIdAndDelete(id);
      }
    
}

module.exports = timeTrackService