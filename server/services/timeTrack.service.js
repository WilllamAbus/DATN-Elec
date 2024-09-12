const moment = require('moment-timezone');
const Time_Track = require('../model/time-track.model');
const Product_v2 = require('../model/product_v2')
 // Your local time zone

 const currentTimeInHCM = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');
console.log('Current time in HCM:', currentTimeInHCM);
const timeTrackService = {
      /**
   * Tạo một bản ghi TimeTrack mới với thời gian bắt đầu và kết thúc hiện tại
   * @param {Object} data - Dữ liệu để tạo TimeTrack, có thể bao gồm startTime và endTime
   * @returns {Promise<Object>} - Đối tượng TimeTrack đã được lưu
   */
      createTimeTrack: async (productId, data) => {
        try {
          // Tìm sản phẩm và chỉ lấy các trường cần thiết, sử dụng lean() để giảm memory overhead
          const product = await Product_v2.findOne({ _id: productId, status: { $ne: "disable" } })
            .select('product_format')
            .populate('product_format', 'formats')
            .lean();
          
          if (!product) {
            throw new Error('Sản phẩm không tồn tại hoặc đã bị vô hiệu hóa.');
          }
      
          // Kiểm tra xem `product_format` có tồn tại không và lấy thông tin định dạng
          const format = product.product_format.formats.trim();
      
          if (format !== "Đấu giá") {
            return null;
          }
      
          const timeZone = 'Asia/Ho_Chi_Minh';
          const now = moment.tz(timeZone).toDate();
      
          const endTime = data.endTime ? moment.tz(data.endTime, timeZone).toDate() : null;
          const endTimeBid = data.endTimeBid ? moment.tz(data.endTimeBid, timeZone).toDate() : null;
      
          console.log(`Incoming endTime: ${data.endTime}, Incoming endTimeBid: ${data.endTimeBid}`);
      
          // Ensure at least one of endTime or endTimeBid is provided
          if (!endTime && !endTimeBid) {
            throw new Error('You must provide either endTime or endTimeBid.');
          }
      
          // If both are provided, they should match
          if (endTime && endTimeBid && endTime.getTime() !== endTimeBid.getTime()) {
            throw new Error('endTime and endTimeBid do not match.');
          }
      
          // Use whichever value is provided (or both if they match)
          const finalEndTime = endTime || endTimeBid;
      
          // Validate that finalEndTime is within 30 days from now
          const maxAllowedEndTime = moment(now).add(30, 'days').toDate();
      
          if (finalEndTime > maxAllowedEndTime) {
            throw new Error('endTime or endTimeBid must be within 30 days from the current time.');
          }
      
          // Determine the stateTime
          const stateTime = now <= finalEndTime ? "Thời gian đang chạy" : "Thời gian kết thúc";
      
          // Create the Time_Track instance
          const timeTrack = new Time_Track({
            productId,
            startTime: now,
            endTime: finalEndTime,
            endTimeBid: finalEndTime,  // Use the same value for consistency
            stateTime
          });
      
          return await timeTrack.save();
        } catch (error) {
          console.error('Error in createTimeTrack service:', error);
          throw error; // Ném lỗi để được xử lý ở nơi gọi hàm
        }
      },
      
      getTimeTrackByProduct: async ( productId) => {
       
        try {
          // Fetch the time track for the product
          const timeTrack = await Time_Track.findOne({ productId }).lean();
          
          if (!timeTrack) throw new Error("Time track không tồn tại");
      
          // Check if stateTime is "Thời gian kết thúc"
          if (timeTrack.stateTime === "Thời gian kết thúc") {
            const updatedEndTime = moment(timeTrack.endTime).tz('Asia/Ho_Chi_Minh').add(15, 'minutes').toDate();
            
            // Update the endTime and stateTime
            await Time_Track.updateOne(
              { _id: timeTrack._id },
              { 
                endTime: updatedEndTime,
                stateTime: "Thời gian đang chạy"
              }
            );
            
            // Update the in-memory timeTrack object with the new values
            timeTrack.endTime = updatedEndTime;
            timeTrack.stateTime = "Thời gian đang chạy";
          }
      
          const timeTracks = timeTrack.productId;
          const endTime = timeTrack.endTime || null;
          const endTimeBid = timeTrack.endTimeBid || null;
          // Fetch product details
          const product = await Product_v2.findOne({
            _id: timeTracks,
            status: { $ne: "disable" },
          })
          .populate('product_format', 'formats')
          .populate('product_condition', 'nameCondition')
          .populate('product_supplier', 'name')
          .lean();
          
          if (!product) {
            throw new Error('Sản phẩm không tồn tại hoặc đã bị vô hiệu hóa.');
          }
      
          // Check if product format exists and get the format information
          const format = product.product_format?.formats.trim();
      
          if (format !== 'Đấu giá') {
            return null;
          }
      
          // Extract images (assuming they are stored as an array of URLs or image objects)
          const images = product.image.map((img) => ({
            url: img.url || img,  // Replace with actual image field names if necessary
            alt: img.alt || 'Product image',  // Example: adding an alt text
          }));
      
          // Extract and format product attributes
          const productAttributes = product.product_attributes.map((attribute) => ({
            key: attribute.k,  // 'k' for key
            value: attribute.v,  // 'v' for value
          }));
      
          // Construct the product details object
          const productDetails = {
            _id: product._id,
            product_name: product.product_name,
            product_description: product.product_description,
            product_type: product.product_type.name,
            product_format: product.product_format?.formats,
            product_condition: product.product_condition?.nameCondition || 'Unknown',
            product_supplier: product.product_supplier?.name || 'Unknown',
            product_ratingAvg: product.product_ratingAvg,
            product_view: product.product_view,
            product_price_unit: product.product_price_unit,
            weight_g: product.weight_g,
            product_slug: product.product_slug,
            images,  // Array of image objects
            productAttributes,  // Array of attribute objects with key-value pairs
            endTime,
            endTimeBid  // End time from the time tracking data
          };
      
          return productDetails;
        } catch (error) {
          console.error('Error in getTimeTrackByProduct service:', error);
          throw new Error(error.message);
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
       await timeTrackService.updateTimeTrack(timeTrackId, { endTime });
  
        // Kiểm tra kết quả cập nhật
       
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
