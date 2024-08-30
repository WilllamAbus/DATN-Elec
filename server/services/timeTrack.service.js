const moment = require('moment-timezone');
const Time_Track = require('../model/time-track.model');

 // Your local time zone

 const currentTimeInHCM = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');
console.log('Current time in HCM:', currentTimeInHCM);
const timeTrackService = {
      /**
   * Tạo một bản ghi TimeTrack mới với thời gian bắt đầu và kết thúc hiện tại
   * @param {Object} data - Dữ liệu để tạo TimeTrack, có thể bao gồm startTime và endTime
   * @returns {Promise<Object>} - Đối tượng TimeTrack đã được lưu
   */
      createTimeTrack: async (data) => {
        try {
          
          // Lấy thời gian hiện tại theo thời gian thực
          const startTime = moment().tz(currentTimeInHCM).toDate();
          const endTime = moment().tz(currentTimeInHCM).add(1, 'hour').toDate(); // Ví dụ, endTime là sau 1 giờ
            
          // Tạo một instance mới của Time_Track với thời gian thực
          const timeTrack = new Time_Track({
            startTime,
            endTime,
            ...data // Kết hợp dữ liệu bổ sung từ tham số vào đối tượng mới
          });
    
          return await timeTrack.save();
        } catch (error) {
          console.error('Error in createTimeTrack service:', error);
          throw error; // Ném lỗi để được xử lý ở nơi gọi hàm
        }
      },

      getTimeTrackById: async (id) => {
        try {
          const timeTrack = await Time_Track.findById(id);
          if (!timeTrack) return null;
    
          // Chuyển đổi thời gian từ UTC sang giờ Việt Nam
          const startTime = moment(timeTrack.startTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');
          const endTime = moment(timeTrack.endTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');
          
          // Xác định trạng thái của bản ghi
          const status = moment(timeTrack.endTime, 'DD/MM/YYYY HH:mm:ss').isBefore(moment()) ? 'expired' : 'active';
    
          // Trả về đối tượng với dữ liệu đã được định dạng
          return {
            _id: timeTrack._id,
            startTime,
            endTime,
            status,
          };
        } catch (error) {
          throw new Error(`Error retrieving TimeTrack: ${error.message}`);
        }
      },

      getAllTimeTracks: async () => {
        try {
          const timeTracks = await Time_Track.find({});
          
          // Chuyển đổi thời gian từ UTC sang giờ Việt Nam cho tất cả các bản ghi
          const updatedTimeTracks = timeTracks.map(track => {
          const utcTrandStart =   track.startTime = moment(track.startTime).tz(currentTimeInHCM).format('DD/MM/YYYY HH:mm:ss');
         const  utcTrandEnd =   track.endTime = moment(track.endTime).tz(currentTimeInHCM).format('DD/MM/YYYY HH:mm:ss');
            return {startTime: utcTrandStart , endTime: utcTrandEnd};
          });
         
        
          return updatedTimeTracks;
        } catch (error) {
            console.error(error)
          throw new Error(`Error retrieving TimeTracks: ${error.message}`);
        }
      },
  /**
   * Cập nhật bản ghi TimeTrack theo ID
   * @param {string} id - ID của TimeTrack cần cập nhật
   * @param {Object} data - Dữ liệu để cập nhật, có thể bao gồm startTime và endTime
   * @returns {Promise<Object>} - Đối tượng TimeTrack đã được cập nhật
   */
   /**
   * Cập nhật bản ghi TimeTrack theo ID
   * @param {string} id - ID của TimeTrack cần cập nhật
   * @param {Object} data - Dữ liệu để cập nhật, có thể bao gồm startTime và endTime
   * @returns {Promise<Object>} - Đối tượng TimeTrack đã được cập nhật
   */
   updateTimeTrack: async (id, data) => {
    try {
      // Chuyển đổi endTime sang UTC trước khi lưu vào cơ sở dữ liệu
      if (data.endTime) {
        data.endTime = moment(data.endTime).tz('Asia/Ho_Chi_Minh').utc().toDate();
      }
  
      const updatedTimeTrack = await Time_Track.findByIdAndUpdate(id, data, { new: true });
      if (!updatedTimeTrack) {
        throw new Error('TimeTrack not found');
      }
      return updatedTimeTrack;
    } catch (error) {
      console.error('Error in updateTimeTrack service:', error);
      throw new Error(`Error updating TimeTrack: ${error.message}`);
    }
  },


  updateEndTimeInRealTime: async (timeTrackId) => {
    const interval = setInterval(async () => {
      try {
        // Lấy thời gian hiện tại theo múi giờ Hồ Chí Minh và chuyển đổi sang UTC
        const endTime = moment().tz('Asia/Ho_Chi_Minh').utc().toDate();
        // console.log('Updating endTime to:', endTime);
  
        // Cập nhật endTime trong cơ sở dữ liệu
        const updatedTimeTrack = await timeTrackService.updateTimeTrack(timeTrackId, { endTime });
  
        // Kiểm tra kết quả cập nhật
        if (updatedTimeTrack) {
          console.log('Real-time updated TimeTrack:', updatedTimeTrack);
        } else {
          console.log('No TimeTrack updated');
        }
      } catch (error) {
        console.error('Error updating endTime in real-time:', error);
      }
    }, 1000); // Cập nhật mỗi giây
  
    // Dừng interval sau 10 giây (hoặc điều chỉnh theo nhu cầu)
    setTimeout(() => {
      clearInterval(interval);
      // console.log('Stopped real-time update');
    }, 10000);
  },

  updateStartTimeInRealTime: async (id) => {
    const interval = setInterval(async () => {
      try {
        const timeTrack = await Time_Track.findById(id);
        if (!timeTrack) {
          clearInterval(interval);
          // console.log('TimeTrack not found. Stopped updating.');
          return;
        }

        // Cập nhật startTime với thời gian hiện tại
        const currentTime = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');
        const utcTime = timeTrack.startTime = currentTime;
        await utcTime.save();

        // Kiểm tra endTime và xóa bản ghi nếu cần
        if (moment(timeTrack.endTime, 'DD/MM/YYYY HH:mm:ss').isBefore(moment())) {
          await Time_Track.findByIdAndDelete(id);
          clearInterval(interval);
          // console.log('TimeTrack deleted as endTime has passed.');
        }
      } catch (error) {
        console.error('Error updating startTime in real-time:', error);
      }
    }, 1000); // Cập nhật mỗi giây
  },

  deleteTimeTrack: async (id) => {
    try {
      return await Time_Track.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error in createTimeTrack service:', error);
      throw new Error(`Error deleting TimeTrack: ${error.message}`);
    }
  }
}

module.exports = timeTrackService;
