// Đảm bảo đường dẫn chính xác
const AuctionPricingRange = require("../../../../model/productAuction/auctionPricingRange"); // Đường dẫn đến model
const ProductAuction = require("../../../../model/productAuction/productAuction"); // Model tham chiếu
const inBound = require("../../../../model/inboundShipments.model");
const { convertToLocalTime } = require("../../../../utils/timeConverter");
const randBinController = {
  postRandBid: async (req, res) => {
    try {
      const {
        maxPrice,
        startTime,
        endTime,
        product_randBib,
        priceStep,
        startingPrice,
      } = req.body;

      
      const thousandPlace = Math.floor(parseFloat(maxPrice) / 1000) % 2;
      const lastThreeDigits = parseInt(maxPrice) % 1000;
      const thousanPriceStep = Math.floor(parseFloat(priceStep) / 1000) % 2;
      const lastThreeDigitsPriceStep = parseInt(priceStep) % 1000;
      const thousanStartingPrice =
        Math.floor(parseFloat(startingPrice) / 1000) % 2;
      const lastThreeDigitsStartingPrice = parseInt(startingPrice) % 1000;
      // Validate `endTime` must be greater than `startTime`
      if (new Date(endTime) <= new Date(startTime)) {
        return res.status(400).json({
          error: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
        });
      }

      // Check if `product_randBib` exists and is active
      const productExists = await ProductAuction.findOne({
        _id: product_randBib,
        status: "active",
      });
      if (!productExists) {
        return res
          .status(400)
          .json({ msg: "Sản phẩm đã tồn tại hoặc đã vô hiệu hóa" });
      }

      if (productExists.auctionPricing) {
        return res.status(400).json({
          msg: "Sản phẩm này đã có khoảng giá đấu giá, không thể thêm mới",
        });
      }

      // Fetch `inBoundPrice` for the product
      const inboundPriceStep = await inBound.findOne({
        status: "active",
        productAuction: product_randBib,
      });

      if (!inboundPriceStep || !inboundPriceStep.inbound_price) {
        return res.status(400).json({
          msg: "Không tìm thấy giá nhập hàng phù hợp cho sản phẩm này",
        });
      }

      const inBoundPrice = parseFloat(inboundPriceStep.inbound_price);
      const startingPriceNum = parseFloat(startingPrice);

      // Log giá trị để debug

      // Bước 4: Kiểm tra giá khởi điểm
      if (startingPriceNum <= inBoundPrice) {
        return res.status(400).json({
          msg: "Giá khởi điểm phải lớn hơn giá nhập hàng",
        });
      }

      // Validate `maxPrice` must be greater than `startingPrice`
      if (parseFloat(maxPrice) <= parseFloat(startingPrice)) {
        return res.status(400).json({
          msg: "Giá tối đa phải lớn hơn giá khởi điểm",
        });
      }

      // Validate `maxPrice` ends with a digit divisible by 2

      if (thousandPlace !== 0) {
        return res.status(400).json({
          error: "Giá tối đa phải có số ở hàng nghìn phải chia hết cho 2.",
        });
      }

      // Kiểm tra số ở hàng trăm, chục, đơn vị phải là 0
      // Lấy ba chữ số cuối
      if (lastThreeDigits !== 0) {
        return res.status(400).json({
          error: "Giá tối đa phải có số ở hàng trăm, chục và đơn vị phải là 0.",
        });
      }

      if (thousanPriceStep !== 0) {
        return res.status(400).json({
          error: "Bước giá phải có số ở hàng nghìn phải chia hết cho 2.",
        });
      }

      if (lastThreeDigitsPriceStep !== 0) {
        return res.status(400).json({
          error: "Bước giá phải có số ở hàng trăm, chục và đơn vị phải là 0.",
        });
      }

      if (thousanStartingPrice !== 0) {
        return res.status(400).json({
          error: "Giá khởi điểm phải có số ở hàng nghìn phải chia hết cho 2.",
        });
      }

      if (lastThreeDigitsStartingPrice !== 0) {
        return res.status(400).json({
          error:
            "Giá khởi điểm phải có số ở hàng trăm, chục và đơn vị phải là 0.",
        });
      }

      // Convert time to local timezone (Assume `convertToLocalTime` function is defined)
      const startTimeLocal = convertToLocalTime(startTime);
      const endTimeLocal = convertToLocalTime(endTime);

      // Create new auction range
      const auctionPricingRange = new AuctionPricingRange({
        startTime: startTimeLocal,
        endTime: endTimeLocal,
        startingPrice,
        maxPrice,
        priceStep,
        product_randBib,
        currentPrice: startingPrice,
        status: 'disable'
      });

      // Save auction pricing range to the database
      const savedAuction = await auctionPricingRange.save();

      
      // Update `ProductAuction` with reference to `AuctionPricingRange`
      await ProductAuction.findOneAndUpdate(
        { _id: product_randBib },
        { $set: { auctionPricing: savedAuction._id ,
             product_price: startingPrice} },
        { new: true }
      );

      // Return response
      res.status(201).json({
        success: true,
        message: "Khoảng giá đã được tạo thành công.",
        data: savedAuction,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  getProductInBoutAdmin: async (req, res) => {
    try {
      const { productId } = req.query;

      const productInbound = await inBound.findOne({
        productAuction: productId,
        status: "active",
      });
      res.status(201).json({
        success: true,
        message: "Lấy giá nhập thành công.",
        data: productInbound,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  getAllPriceRange: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;
      const search = req.query.search || "";

      // Fetch price range with active status
      const priceRange = await AuctionPricingRange.find({ status: "active" })
        .select(
          "product_randBib startTime endTime startingPrice maxPrice currentPrice priceStep status"
        )
        .lean();

      const productIds = priceRange.map(
        (priceRange) => priceRange.product_randBib
      );

      // Fetch active products that are in the price range
      const products = await ProductAuction.find({
        _id: { $in: productIds },
        status: "active",
      })
        .select("_id image product_name ")
        .lean();

      // Map products to a productMap for easier access
      const productMap = {};
      products.forEach((product) => {
        productMap[product._id] = product;
      });

      // Combine price range with product data
      const matchedPriceRandge = priceRange
        .map((priceRange) => {
          const productIdStr = priceRange.product_randBib.toString(); // Convert ObjectId to string
          const product = productMap[productIdStr]; // Get product from productMap

          if (product) {
            return {
              ...priceRange, // Include price range info
              product, // Include product info
            };
          }
          return null;
        })
        .filter((track) => track !== null); // Filter out null values

      // Sort matched price range by maxPrice in descending order
      const sortedPriceRandge = matchedPriceRandge.sort(
        (a, b) => b.maxPrice - a.maxPrice
      );

      // Filter by search term if provided
      const searchResults = search
        ? sortedPriceRandge.filter((priceRange) => {
            const productName = priceRange.product.product_name.toLowerCase();
            return productName.includes(search.toLowerCase());
          })
        : sortedPriceRandge;

      const totalItems = searchResults.length; // Total items after filtering
      const totalBuckets = Math.ceil(totalItems / pageSize); // Total buckets (pages)
      const bucket = Math.min(totalBuckets, page); // Current bucket (page)
      const paginatedResults = searchResults.slice(
        (bucket - 1) * pageSize,
        bucket * pageSize
      ); // Get the current page's results

      // Add serial number to each item in the paginated results
      const paginatedResultsWithIndex = paginatedResults.map((item, index) => ({
        serialNumber: (page - 1) * pageSize + index + 1, // Calculate the serial number based on the page and index
        ...item,
      }));

      const totalPages = totalBuckets;

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách đấu giá thành công",
        data: {
          priceRangesAuct: paginatedResultsWithIndex, // Return the paginated results with serial numbers
          totalPages: totalPages,
          currentPage: page,
          allPriceRand: sortedPriceRandge, // Return the sorted full list as well
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  editPriceRange: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        maxPrice,
        startTime,
        endTime,
        product_randBib,
        priceStep,
        startingPrice,
      } = req.body;
 
      
      const thousandPlace = Math.floor(parseFloat(maxPrice) / 1000) % 2;
      const lastThreeDigits = parseInt(maxPrice) % 1000;
      const thousanPriceStep = Math.floor(parseFloat(priceStep) / 1000) % 2;
      const lastThreeDigitsPriceStep = parseInt(priceStep) % 1000;
      const thousanStartingPrice =
        Math.floor(parseFloat(startingPrice) / 1000) % 2;
      const lastThreeDigitsStartingPrice = parseInt(startingPrice) % 1000;
      // Validate `endTime` must be greater than `startTime`
      if (new Date(endTime) <= new Date(startTime)) {
        return res.status(400).json({
          error: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
        });
      }
   
     

      // Kiểm tra sản phẩm tham chiếu `product_randBib` có tồn tại không
      const productExists = await ProductAuction.findById(product_randBib);
      if (!productExists) {
        return res.status(404).json({
          msg: "Sản phẩm đã tồn tại",
        });
      }

  
      if (!productExists) {
        return res
          .status(400)
          .json({ msg: "Sản phẩm đã tồn tại hoặc đã vô hiệu hóa" });
      }

    //   if (productExists.auctionPricing) {
    //     return res.status(400).json({
    //       msg: "Sản phẩm này đã có khoảng giá đấu giá, không thể thêm mới",
    //     });
    //   }

      // Fetch `inBoundPrice` for the product
      const inboundPriceStep = await inBound.findOne({
        status: "active",
        productAuction: product_randBib,
      });

      if (!inboundPriceStep || !inboundPriceStep.inbound_price) {
        return res.status(400).json({
          msg: "Không tìm thấy giá nhập hàng phù hợp cho sản phẩm này",
        });
      }

      const inBoundPrice = parseFloat(inboundPriceStep.inbound_price);
      const startingPriceNum = parseFloat(startingPrice);

      // Log giá trị để debug

      // Bước 4: Kiểm tra giá khởi điểm
      if (startingPriceNum <= inBoundPrice) {
        return res.status(400).json({
          msg: "Giá khởi điểm phải lớn hơn giá nhập hàng",
        });
      }

      // Validate `maxPrice` must be greater than `startingPrice`
      if (parseFloat(maxPrice) <= parseFloat(startingPrice)) {
        return res.status(400).json({
          msg: "Giá tối đa phải lớn hơn giá khởi điểm",
        });
      }

      // Validate `maxPrice` ends with a digit divisible by 2

      if (thousandPlace !== 0) {
        return res.status(400).json({
          error: "Giá tối đa phải có số ở hàng nghìn phải chia hết cho 2.",
        });
      }

      // Kiểm tra số ở hàng trăm, chục, đơn vị phải là 0
      // Lấy ba chữ số cuối
      if (lastThreeDigits !== 0) {
        return res.status(400).json({
          error: "Giá tối đa phải có số ở hàng trăm, chục và đơn vị phải là 0.",
        });
      }

      if (thousanPriceStep !== 0) {
        return res.status(400).json({
          error: "Bước giá phải có số ở hàng nghìn phải chia hết cho 2.",
        });
      }

      if (lastThreeDigitsPriceStep !== 0) {
        return res.status(400).json({
          error: "Bước giá phải có số ở hàng trăm, chục và đơn vị phải là 0.",
        });
      }

      if (thousanStartingPrice !== 0) {
        return res.status(400).json({
          error: "Giá khởi điểm phải có số ở hàng nghìn phải chia hết cho 2.",
        });
      }

      if (lastThreeDigitsStartingPrice !== 0) {
        return res.status(400).json({
          error:
            "Giá khởi điểm phải có số ở hàng trăm, chục và đơn vị phải là 0.",
        });
      }

      // Convert time to local timezone (Assume `convertToLocalTime` function is defined)
      const startTimeLocal = convertToLocalTime(startTime);
      const endTimeLocal = convertToLocalTime(endTime);

      // Cập nhật document
      const updatedAuction = await AuctionPricingRange.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            _id: id,
            maxPrice: maxPrice,
            startTime: startTimeLocal,
            endTime: endTimeLocal,
            product_randBib: product_randBib,
            startingPrice: startingPrice,
            priceStep: priceStep,
            currentPrice: startingPrice,
            status: 'disable',
          },
        },
        { new: true}
      );
  
      
      await ProductAuction.findOneAndUpdate(
        { _id: product_randBib },
        { $set: { auctionPricing:id ,
             product_price: startingPrice} },
        { new: true }
      );
      // Kiểm tra nếu không tìm thấy document cần cập nhật
      if (!updatedAuction) {
        return res.status(404).json({
          msg: "Không tìm thấy khoảng định giá",
        });
      }

      // Trả về kết quả thành công
      return res.status(200).json({
        message: "Khoảng giá được cập nhật thành công",
        status: "200",
        data: updatedAuction,
      });
    } catch (error) {
      console.error("Error updating AuctionPricingRange:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getByIdPriceRanAuct: async(req, res) =>{
    try {
        const { id } = req.params;
    
        // Find AuctionPricerand by ID
        const auctionPricerand = await AuctionPricingRange.findOne({_id:id}).populate({
            path: 'product_randBib',
               });
      ;
    
        
    
        if (!auctionPricerand) {
          return res.status(404).json({ message: 'AuctionPricerand not found' });
        }
    
        // Extract related data

        const productAuctId = auctionPricerand.product_randBib._id;
        const inBoundary = await inBound.findOne({productAuction:productAuctId}).lean()
        const starTimeTrach = convertToLocalTime(auctionPricerand.startTime)
        const endTimeTrach = convertToLocalTime(auctionPricerand.endTime)
        const group = {
            auctionPricerand: auctionPricerand,
            auctTionStartTime: starTimeTrach,
            auctionEndTime: endTimeTrach,
            inboundPrice: inBoundary.inbound_price,
        }
        return res.status(200).json({
            message: "Khoảng giá được cập nhật thành công",
            status: "200",
            data: group,
          });

        // Respond with data
     
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
      }
  }, 
  restorePriceRangeBid: async (req, res) => {
    try {
      const { id } = req.params;

      const serchProductRand = await AuctionPricingRange.findOne({
        _id: id,
      }).lean();

      const productRand = serchProductRand.product_randBib;
      // const startTimeConver = convertToLocalTime(serchProductRand.start_time)
      // const endTimeConver = convertToLocalTime(serchProductRand.end_time)
      // Cập nhật trạng thái của sản phẩm thành 'disable'
      const updatedProduct = await ProductAuction.findByIdAndUpdate(
        productRand,
        { status: "active" },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          error: "Không tìm thấy sản phẩm để cập nhật trạng thái",
        });
      }

      // Tìm kiếm và cập nhật `status` thành `deleted`
      const updatedAuction = await AuctionPricingRange.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
      );

      // Kiểm tra nếu không tìm thấy document cần xóa mềm
      if (!updatedAuction) {
        return res.status(404).json({
          error: "Không tìm thấy khoảng định giá",
        });
      }

      // Trả về kết quả thành công
      return res.status(200).json({
        message: "Khoảng định giá khôi phục thành công",
        status: "200",
        data: updatedAuction,
      });
    } catch (error) {
      console.error("Error soft deleting AuctionPricingRange:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  deletePriceRangeBid: async (req, res) => {
    try {
      const { id } = req.params;

      // Kiểm tra xem _id có hợp lệ không

      // Xóa document theo _id
      const deletedAuction = await AuctionPricingRange.findByIdAndDelete(id);

      // Kiểm tra nếu không tìm thấy document để xóa
      if (!deletedAuction) {
        return res.status(404).json({ msg: "Không tìm thấy khoảng định giá" });
      }
   
  
      // Cập nhật các sản phẩm liên quan, đặt trường auctionPricing thành null
      await ProductAuction.findOneAndUpdate(
        { auctionPricing: id, status: 'disable' }, // Tìm sản phẩm có auctionPricing liên kết với id và status là 'disable'
        { $set: { auctionPricing: null } } // Đặt auctionPricing thành null
      );

      // Trả về kết quả thành công
      return res.status(200).json({
        message: "Khoảng giá xóa thành công",
        status: "200",
        data: deletedAuction,
      });
    } catch (error) {
      console.error("Error deleting AuctionPricingRange:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  softDeletePriceRangeBid: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedAuction = await AuctionPricingRange.findByIdAndUpdate(
        id,
        { status: "deleted" },
        { new: true }
      );
      const serchProductRand = await AuctionPricingRange.findOne({
        _id: id,
      }).lean();

      const productRand = serchProductRand.product_randBib;
 
      // Cập nhật trạng thái của sản phẩm thành 'disable'
      const updatedProduct = await ProductAuction.findByIdAndUpdate(
        productRand,
        { status: "disable" },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          error: "Không tìm thấy sản phẩm để cập nhật trạng thái",
        });
      }
      // Tìm kiếm và cập nhật `status` thành `deleted`
  

      // Kiểm tra nếu không tìm thấy document cần xóa mềm
   

      // Trả về kết quả thành công
      return res.status(200).json({
        message: "Khoảng định giá xóa thành công",
        status: "200",
        data: updatedAuction,
      });
    } catch (error) {
      console.error("Error soft deleting AuctionPricingRange:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getDeletedPriceRangeBid: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
 
      
      const pageSize = parseInt(req.query.pageSize) || 5;

      const search = req.query.search || "";

      
      const priceRange = await AuctionPricingRange.find({ status: "disable" })
        .select(
          "product_randBib startTime endTime startingPrice maxPrice currentPrice priceStep status"
        )

        .lean();
   
        
      const productIds = priceRange.map(
        (priceRange) => priceRange.product_randBib
      );

      const products = await ProductAuction.find({
        _id: { $in: productIds },
        status: "active",
      })
        .select("_id image product_name ")
        .lean();


      
      const productMap = {};
      products.forEach((product) => {
        productMap[product._id] = product;
      });

      const matchedPriceRandge = priceRange
        .map((priceRange) => {
          const productIdStr = priceRange.product_randBib.toString(); // Chuyển ObjectId thành chuỗi
          const product = productMap[productIdStr]; // Lấy thông tin sản phẩm từ productMap

          // Nếu sản phẩm tồn tại, kết hợp thông tin từ timeTrack và product
          if (product) {
            return {
              ...priceRange, // Thêm thông tin timeTrack
              product, // Thêm thông tin sản phẩm
            };
          }
          return null; // Trả về null nếu không tìm thấy sản phẩm
        })
        .filter((track) => track !== null); // Lọc các phần tử null
      
        
      const sortedPriceRandge = matchedPriceRandge.sort(
        (a, b) => b.maxPrice - a.maxPrice
      );
    
      
      const allPriceRand = matchedPriceRandge.map((track) => ({
        priceRandId: track._id,

        productId: track.product._id,
        productName: track.product.product_name,
        image: track.product.image, // Lấy hình ảnh từ sản phẩm
      }));

      const searchResults = search
        ? sortedPriceRandge.filter((priceRange) => {
            const productName = priceRange.product.product_name.toLowerCase();
            return productName.includes(search.toLowerCase());
          })
        : sortedPriceRandge;
      const totalItems = searchResults.length; // Tổng số mục sau khi lọc
      const totalBuckets = Math.ceil(totalItems / pageSize); // Tổng số bucket
      const bucket = Math.min(totalBuckets, page); // Chỉ số bucket hiện tại
      const paginatedResults = searchResults.slice(
        (bucket - 1) * pageSize,
        bucket * pageSize
      ); // Lấy dữ liệu của bucket
      const paginatedResultsWithIndex = paginatedResults.map((item, index) => ({
        serialNumber: (page - 1) * pageSize + index + 1, // Calculate the serial number based on the page and index
        ...item,
      }));
      // Bước 8: Tính toán tổng số trang
      const totalPages = totalBuckets;

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách đấu giá thành công",
        data: {
          priceRangesDeleted: paginatedResultsWithIndex,
          totalPages: totalPages,
          currentPage: page,
          allPriceRand,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = randBinController;
