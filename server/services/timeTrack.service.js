const moment = require("moment-timezone");
const Time_Track = require("../model/time-track.model");
const Product_v2 = require("../model/productAuction/productAuction");
// Your local time zone

const currentTimeInHCM = moment()
  .tz("Asia/Ho_Chi_Minh")
  .format("DD/MM/YYYY HH:mm:ss");

const timeTrackService = {
  /**
   * Tạo một bản ghi TimeTrack mới với thời gian bắt đầu và kết thúc hiện tại
   * @param {Object} data - Dữ liệu để tạo TimeTrack, có thể bao gồm startTime và endTime
   * @returns {Promise<Object>} - Đối tượng TimeTrack đã được lưu
   */
  createTimeTrack: async (productId, data) => {
    try {
      const existingTimeTrack = await Time_Track.findOne({
        productId,
        status: { $ne: "disable" },
      });

      if (existingTimeTrack) {
        throw new Error("Time track cho sản phẩm này đã tồn tại.");
      }
      // Tìm sản phẩm và chỉ lấy các trường cần thiết, sử dụng lean() để giảm memory overhead
      const product = await Product_v2.findOne({
        _id: productId,
        status: { $ne: "disable" },
      })
      .lean();

      if (!product) {
        throw new Error("Sản phẩm không tồn tại hoặc đã bị vô hiệu hóa.");
      }

      // Kiểm tra xem `product_format` có tồn tại không và lấy thông tin định dạng

      const timeZone = "Asia/Ho_Chi_Minh";
      const now = moment.tz(timeZone).toDate();

      const endTime = data.endTime
        ? moment.tz(data.endTime, timeZone).toDate()
        : null;
      const endTimeBid = data.endTimeBid
        ? moment.tz(data.endTimeBid, timeZone).toDate()
        : null;

      // console.log(`Incoming endTime: ${data.endTime}, Incoming endTimeBid: ${data.endTimeBid}`);

      // Ensure at least one of endTime or endTimeBid is provided
      if (!endTime && !endTimeBid) {
        throw new Error("You must provide either endTime or endTimeBid.");
      }

      // If both are provided, they should match
      if (endTime && endTimeBid && endTime.getTime() !== endTimeBid.getTime()) {
        throw new Error("endTime and endTimeBid do not match.");
      }

      // Use whichever value is provided (or both if they match)
      const finalEndTime = endTime || endTimeBid;

      // Validate that finalEndTime is within 30 days from now
      const maxAllowedEndTime = moment(now).add(30, "days").toDate();
      // console.log('maxAllowedEndTime', maxAllowedEndTime);

      if (finalEndTime > maxAllowedEndTime) {
        throw new Error(
          "Thời gian kết thúc không vượt quá 30 ngày so với thời gian hiện tại."
        );
      }

      // Determine the stateTime
      const stateTime =
        now <= finalEndTime ? "Thời gian đang chạy" : "Thời gian kết thúc";
      // Create the Time_Track instance
      const timeTrack = new Time_Track({
        productId,
        startTime: now,
        endTime: finalEndTime,
        endTimeBid: finalEndTime, // Use the same value for consistency
        stateTime,
      });

      return await timeTrack.save();
    } catch (error) {
      console.error("Error in createTimeTrack service:", error);
      throw error; // Ném lỗi để được xử lý ở nơi gọi hàm
    }
  },

  getTimeTrackByProduct: async (productId) => {
    try {
      // Fetch the time track for the product
      const currentTimeInHCM = moment().tz("Asia/Ho_Chi_Minh");
      const timeTrack = await Time_Track.findOne({productId: productId }).lean();
      console.log('Time track', timeTrack);
      
      if (!timeTrack) throw new Error("Time track không tồn tại");

      // Check if stateTime is "Thời gian kết thúc"
      if (timeTrack.stateTime === "Thời gian kết thúc") {
        const updatedEndTime = moment(timeTrack.endTime)
          .tz("Asia/Ho_Chi_Minh")
          .add(15, "minutes")
          .toDate();

        // Update the endTime and stateTime
        await Time_Track.updateOne(
          { _id: timeTrack._id },
          {
            endTime: updatedEndTime,
            stateTime: "Thời gian đang chạy",
          }
        );

        // Update the in-memory timeTrack object with the new values
        timeTrack.endTime = updatedEndTime;
        timeTrack.stateTime = "Thời gian đang chạy";
      }

      const timeTracks = timeTrack.productId;
      const endTime = timeTrack.endTime || null;
      const endTimeBid = timeTrack.endTimeBid || null;
      
      // if (endTime && moment(endTime).isBefore(currentTimeInHCM)) {
      //   await Product_v2.updateOne({ _id: timeTracks }, { status: "disable" });
      // }
      // Fetch product details
      const product = await Product_v2.findOne({
        _id: timeTracks,
        status: { $ne: "disable" },
      })

        .populate("product_condition", "nameCondition")
        .populate("product_supplier", "name")
        .lean();

      // Extract images (assuming they are stored as an array of URLs or image objects)
      const images = product.image.map((img) => ({
        url: img.url || img, // Replace with actual image field names if necessary
        alt: img.alt || "Product image", // Example: adding an alt text
      }));

   
      // Construct the product details object
      const productDetails = {
        _id: product._id,
        product_name: product.product_name,
        product_description: product.product_description,
        product_type: product.product_type.name,
        product_format: product.product_format?.formats,
        product_condition:
          product.product_condition?.nameCondition || "Unknown",
        product_supplier: product.product_supplier?.name || "Unknown",
        product_ratingAvg: product.product_ratingAvg,
        product_view: product.product_view,
        product_price_unit: product.product_price_unit,
        weight_g: product.weight_g,
        product_slug: product.product_slug,
        images, // Array of image objects
        // productAttributes, // Array of attribute objects with key-value pairs
        endTime,
        endTimeBid, // End time from the time tracking data
      };

      return productDetails;
    } catch (error) {
      console.error("Error in getTimeTrackByProduct service:", error);
      throw new Error(error.message);
    }
  },
  getTimeTrackById: async (id) => {
    try {
      const timeTrack = await Time_Track.findById(id);

      if (!timeTrack) return null;

      // Step 2: Convert times from UTC to Vietnam time
      const startTime = moment(timeTrack.startTime)
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY HH:mm:ss");
      const endTime = moment(timeTrack.endTime)
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY HH:mm:ss");

      // Step 3: Determine the status
      const status = moment(timeTrack.endTime, "DD/MM/YYYY HH:mm:ss").isBefore(
        moment()
      )
        ? "expired"
        : "active";

      // Step 4: Extract productId from TimeTrack
      const productId = timeTrack.productId; // Adjust according to your Time_Track schema

      // Step 5: Fetch product details from product_v2 using productId
      const product = await Product_v2.findById(productId);
      if (!product) return null;

      // Step 6: Return combined data
      return {
        _id: timeTrack._id,
        product_id: product._id,
        name: product.product_name,
        price: product.product_price_unit,
        startTime,
        endTime,
        endTimeBid: timeTrack.endTimeBid, // Assuming you have this field in your Time_Track schema
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
      const updatedTimeTracks = timeTracks.map((track) => {
        const utcTrandStart = (track.startTime = moment(track.startTime)
          .tz(currentTimeInHCM)
          .format("DD/MM/YYYY HH:mm:ss"));
        const utcTrandEnd = (track.endTime = moment(track.endTime)
          .tz(currentTimeInHCM)
          .format("DD/MM/YYYY HH:mm:ss"));
        return { startTime: utcTrandStart, endTime: utcTrandEnd };
      });

      return updatedTimeTracks;
    } catch (error) {
      console.error(error);
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
        data.endTime = moment(data.endTime)
          .tz("Asia/Ho_Chi_Minh")
          .utc()
          .toDate();
      }

      const updatedTimeTrack = await Time_Track.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedTimeTrack) {
        throw new Error("TimeTrack not found");
      }
      return updatedTimeTrack;
    } catch (error) {
      console.error("Error in updateTimeTrack service:", error);
      throw new Error(`Error updating TimeTrack: ${error.message}`);
    }
  },

  updateEndTimeInRealTime: async (timeTrackId) => {
    const interval = setInterval(async () => {
      try {
        // Lấy thời gian hiện tại theo múi giờ Hồ Chí Minh và chuyển đổi sang UTC
        const endTime = moment().tz("Asia/Ho_Chi_Minh").utc().toDate();
        // console.log('Updating endTime to:', endTime);

        // Cập nhật endTime trong cơ sở dữ liệu
        await timeTrackService.updateTimeTrack(timeTrackId, { endTime });

        // Kiểm tra kết quả cập nhật
      } catch (error) {
        console.error("Error updating endTime in real-time:", error);
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
        const currentTime = moment()
          .tz("Asia/Ho_Chi_Minh")
          .format("DD/MM/YYYY HH:mm:ss");
        const utcTime = (timeTrack.startTime = currentTime);
        await utcTime.save();

        // Kiểm tra endTime và xóa bản ghi nếu cần
        if (
          moment(timeTrack.endTime, "DD/MM/YYYY HH:mm:ss").isBefore(moment())
        ) {
          await Time_Track.findByIdAndDelete(id);
          clearInterval(interval);
          // console.log('TimeTrack deleted as endTime has passed.');
        }
      } catch (error) {
        console.error("Error updating startTime in real-time:", error);
      }
    }, 1000); // Cập nhật mỗi giây
  },

  getAllTimeTracks: async (page = 1, pageSize = 5, search) => {
    try {
      // Bước 1: Tìm tất cả TimeTrack có status là 'active'
      const timeTracks = await Time_Track.find({ status: "active" })
        .select("_id startTime endTime endTimeBid stateTime productId status") // Chỉ lấy các trường cần thiết từ TimeTrack
        .lean();

      // Bước 2: Lấy danh sách productId từ timeTracks
      const productIds = timeTracks.map((timeTrack) => timeTrack.productId);

      // Bước 3: Tìm các sản phẩm có _id nằm trong danh sách productIds
      const products = await Product_v2.find({
        _id: { $in: productIds },
        status: "active",
      })
        .select("_id product_name image ")

        .lean();

      // Bước 3.1: Lọc các sản phẩm có product_format.formats là 'Đấu giá'

      // Bước 4: Tạo map productId -> product để dễ dàng truy cập
      const productMap = {};
      products.forEach((product) => {
        productMap[product._id] = product;
      });

      // Bước 5: Thêm thông tin sản phẩm vào timeTracks
      const matchedTimeTracks = timeTracks
        .map((timeTrack) => {
          const productIdStr = timeTrack.productId.toString(); // Chuyển ObjectId thành chuỗi
          const product = productMap[productIdStr]; // Lấy thông tin sản phẩm từ productMap

          // Nếu sản phẩm tồn tại, kết hợp thông tin từ timeTrack và product
          if (product) {
            return {
              ...timeTrack, // Thêm thông tin timeTrack
              product, // Thêm thông tin sản phẩm
            };
          }
          return null; // Trả về null nếu không tìm thấy sản phẩm
        })
        .filter((track) => track !== null); // Lọc các phần tử null

      // In ra kết quả

      // Lấy danh sách hình ảnh từ matchedTimeTracks
      const allTimeTrack = matchedTimeTracks.map((track) => ({
        timeTrackId: track._id,
        productId: track.product._id,
        productName: track.product.product_name,
        image: track.product.image, // Lấy hình ảnh từ sản phẩm
      }));

      // In ra danh sách hình ảnh

      // Bước 6: Áp dụng tìm kiếm (nếu có)
      const searchResults = search
        ? matchedTimeTracks.filter((timeTrack) => {
            const productName = timeTrack.product.product_name.toLowerCase();
            return productName.includes(search.toLowerCase());
          })
        : matchedTimeTracks;

      // Bước 7: Phân trang
      const totalItems = searchResults.length; // Tổng số mục sau khi lọc
      const totalBuckets = Math.ceil(totalItems / pageSize); // Tổng số bucket
      const bucket = Math.min(totalBuckets, page); // Chỉ số bucket hiện tại
      const paginatedResults = searchResults.slice(
        (bucket - 1) * pageSize,
        bucket * pageSize
      ); // Lấy dữ liệu của bucket

      // Bước 8: Tính toán tổng số trang
      const totalPages = totalBuckets;

      return {
        timeTracks: paginatedResults,
        totalPages: totalPages,
        currentPage: bucket,
        allTimeTrack, // Trả về danh sách hình ảnh
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Error retrieving TimeTracks: ${error.message}`);
    }
  },

  editTimeTrackAdmin: async (id, data) => {
    try {
      const { endTime, endTimeBid } = data;

      // Kiểm tra xem TimeTrack có tồn tại không
      const timeTrack = await Time_Track.findById(id);
      if (!timeTrack) {
        throw new Error("TimeTrack không tồn tại");
      }

      // Lấy thời gian hiện tại
      const now = moment.tz("Asia/Ho_Chi_Minh");

      // Validate endTime, endTimeBid (nếu có)
      const maxAllowedEndTime = now.clone().add(30, "days");

      if (
        endTime &&
        moment.tz(endTime, "Asia/Ho_Chi_Minh").isAfter(maxAllowedEndTime)
      ) {
        throw new Error(
          "endTime không được vượt quá 30 ngày so với thời gian hiện tại"
        );
      }

      if (
        endTimeBid &&
        moment.tz(endTimeBid, "Asia/Ho_Chi_Minh").isAfter(maxAllowedEndTime)
      ) {
        throw new Error(
          "endTimeBid không được vượt quá 30 ngày so với thời gian hiện tại"
        );
      }

      // Tạo đối tượng dữ liệu cập nhật
      const updateData = {
        startTime: now.toDate(), // Gán startTime với thời gian hiện tại
        ...(endTime && {
          endTime: moment.tz(endTime, "Asia/Ho_Chi_Minh").toDate(),
        }),
        ...(endTimeBid && {
          endTimeBid: moment.tz(endTimeBid, "Asia/Ho_Chi_Minh").toDate(),
        }),
      };

      // Cập nhật TimeTrack với findByIdAndUpdate
      const updatedTimeTrack = await Time_Track.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true, // Trả về tài liệu đã được cập nhật
          runValidators: true, // Kiểm tra các bộ quy tắc xác thực
        }
      );

      if (!updatedTimeTrack) {
        throw new Error("Không thể cập nhật TimeTrack");
      }

      return updatedTimeTrack;
    } catch (error) {
      console.error("Error in editTimeTrack service:", error);
      throw new Error(`Error updating TimeTrack: ${error.message}`);
    }
  },

  softDelTimeTrack: async (id) => {
    try {
      const nowUtc = new Date();

      // Chuyển đổi thời gian UTC về múi giờ Việt Nam
      // Múi giờ Việt Nam là UTC + 7 giờ
      const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
      const now = new Date(nowUtc.getTime() + offset);
      // Cập nhật status sang 'disable' bằng findByIdAndUpdate
      const updatedTimeTrack = await Time_Track.findByIdAndUpdate(
        id,
        {
          status: "disable",
          disabledAt: now, // Ghi nhận thời gian vô hiệu hóa
        },
        { new: true } // Trả về document đã được cập nhật
      );

      return updatedTimeTrack;
    } catch (error) {
      console.error("Error in softDelTimeTrack service:", error);
      throw new Error(`Error updating TimeTrack: ${error.message}`);
    }
  },

  restoreTimeTrackAdmin: async (id) => {
    try {
      // Cập nhật status sang 'active' bằng findByIdAndUpdate
      const updatedTimeTrack = await Time_Track.findByIdAndUpdate(
        id,
        {
          status: "active",
          disabledAt: null, // Xóa thời gian vô hiệu hóa
        },
        { new: true } // Trả về document đã được cập nhật
      );

      return updatedTimeTrack;
    } catch (error) {
      console.error("Error in restoreTimeTrack service:", error);
      throw new Error(`Error updating TimeTrack: ${error.message}`);
    }
  },

  deletedTimeTrackAdmin: async (page = 1, pageSize = 5, search) => {
    try {
      // Bước 1: Tìm tất cả TimeTrack có status là 'active'
      const timeTracks = await Time_Track.find({ status: "disable" })
        .select("_id startTime endTime stateTime productId status") // Chỉ lấy các trường cần thiết từ TimeTrack
        .lean();

      // Bước 2: Lấy danh sách productId từ timeTracks
      const productIds = timeTracks.map((timeTrack) => timeTrack.productId);

      // Bước 3: Tìm các sản phẩm có _id nằm trong danh sách productIds
      const products = await Product_v2.find({
        _id: { $in: productIds },
        status: "disable",
      })
        .select("_id product_name image ")

        .lean();

      // Bước 3.1: Lọc các sản phẩm có product_format.formats là 'Đấu giá'

      // Bước 4: Tạo map productId -> product để dễ dàng truy cập
      const productMap = {};
      products.forEach((product) => {
        productMap[product._id] = product;
      });

      // Bước 5: Thêm thông tin sản phẩm vào timeTracks
      const matchedTimeTracks = timeTracks
        .map((timeTrack) => {
          const productIdStr = timeTrack.productId.toString(); // Chuyển ObjectId thành chuỗi
          const product = productMap[productIdStr]; // Lấy thông tin sản phẩm từ productMap

          // Nếu sản phẩm tồn tại, kết hợp thông tin từ timeTrack và product
          if (product) {
            return {
              ...timeTrack, // Thêm thông tin timeTrack
              product, // Thêm thông tin sản phẩm
            };
          }
          return null; // Trả về null nếu không tìm thấy sản phẩm
        })
        .filter((track) => track !== null); // Lọc các phần tử null

      // In ra kết quả

      // Lấy danh sách hình ảnh từ matchedTimeTracks
      const allTimeTrack = matchedTimeTracks.map((track) => ({
        timeTrackId: track._id,
        productId: track.product._id,
        productName: track.product.product_name,
        image: track.product.image, // Lấy hình ảnh từ sản phẩm
      }));

      // In ra danh sách hình ảnh

      // Bước 6: Áp dụng tìm kiếm (nếu có)
      const searchResults = search
        ? matchedTimeTracks.filter((timeTrack) => {
            const productName = timeTrack.product.product_name.toLowerCase();
            return productName.includes(search.toLowerCase());
          })
        : matchedTimeTracks;

      // Bước 7: Phân trang
      const totalItems = searchResults.length; // Tổng số mục sau khi lọc
      const totalBuckets = Math.ceil(totalItems / pageSize); // Tổng số bucket
      const bucket = Math.min(totalBuckets, page); // Chỉ số bucket hiện tại
      const paginatedResults = searchResults.slice(
        (bucket - 1) * pageSize,
        bucket * pageSize
      ); // Lấy dữ liệu của bucket

      // Bước 8: Tính toán tổng số trang
      const totalPages = totalBuckets;

      return {
        timeTracks: paginatedResults,
        totalPages: totalPages,
        currentPage: bucket,
        allTimeTrack, // Trả về danh sách hình ảnh
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Error retrieving TimeTracks: ${error.message}`);
    }
  },

  getProductAuctionAdmin: async () => {
    try {
      // Bước 1: Tìm tất cả sản phẩm có status khác 'disable', populate 'product_format'
      const products = await Product_v2.find({
        status: { $ne: "disable" },
      }); // Populate để lấy thông tin từ collection 'formatshoppings'

      // Bước 2: Lọc ra các sản phẩm có product_format là 'Đấu giá'
      const filteredProducts = products.map((product) => {
        return {
          _id: product._id,
          product_price_unit: product.product_price_unit,
          product_name: product.product_name,
          image: product.image,
        };
      });

      return filteredProducts;
    } catch (error) {
      console.error("Error in getProductAuctionAdmin service:", error);
      throw new Error(`Error retrieving products: ${error.message}`);
    }
  },
  deleteTimeTrack: async (id) => {
    try {
      return await Time_Track.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error in createTimeTrack service:", error);
      throw new Error(`Error deleting TimeTrack: ${error.message}`);
    }
  },
};

module.exports = timeTrackService;
