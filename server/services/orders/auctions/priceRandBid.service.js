const PriceRangeBid = require("../../../model/orders/priceRange.model");
const Product_v2 = require("../../../model/productAuction/productAuction");

const pricRangeBidService = {
  createPriceRange: async (productId, bidInput) => {
    try {
      const existingpricRangeBid = await PriceRangeBid.findOne({"product_randBib.productId": productId , status: { $ne: "disable" }});
 
      
      if (existingpricRangeBid) {
        throw new Error("Khoảng định giá cho sản phẩm này đã tồn tại.");
      }
      // Truy vấn sản phẩm từ cơ sở dữ liệu
      const product = await Product_v2.findOne({
        _id: productId,
        status: { $ne: "disable" },
      })
  

      
      if (!product) {
        throw new Error("Sản phẩm không tồn tại hoặc đã bị vô hiệu hóa.");
      }

   

      // Tính toán giá trị minBid, midBid và maxBid
    

      // Tạo tài liệu mới cho PriceRangeBid
      const minBid = product.product_price_unit;
      const midBid = minBid + (minBid * 0.03); // midBid = minBid + 3%
      const maxBid = midBid + (midBid * 0.04); // maxBid = midBid + 4%

      // Tạo tài liệu mới cho đấu giá
      const newBid = new PriceRangeBid({
        product_randBib: {
          productId: product._id,
          product_price_unit: product.product_price_unit,
          product_name: product.product_name,
      
        },
        minBid,
        midBid,
        maxBid,
        bidInput,
      });

      // Lưu tài liệu mới vào MongoDB
      const savedBid = await newBid.save();
      return savedBid;
    } catch (error) {
      throw new Error(`Có lỗi xảy ra khi tạo đấu giá: ${error.message}`);
    }
  },

  getProductPriceRange: async (productId) => {
    try {
      // Bước 1: Lấy thông tin sản phẩm và kiểm tra định dạng
      const product = await Product_v2.findOne({
        _id: productId,
        status: { $ne: "disable" },
      })
      
    
      
      if (!product) {
        throw new Error("Product not found or is disabled.");
      }
      
   
      
  

      const produtct = product._id
 
      // Bước 2: Lấy danh sách các tài liệu từ mô hình priceRangeBid
      const priceRanges = await PriceRangeBid.find({
        "product_randBib.productId": produtct,
        status: { $ne: "disable" } // Lọc những tài liệu không bị vô hiệu hóa
      });
    
      
      
      if (!priceRanges || priceRanges.length === 0) {
        return [];
      }
  
      // Trả về danh sách các tài liệu phù hợp
      return priceRanges.map((range) => ({
        productId: range.product_randBib.productId,
        productName: range.product_randBib.product_name,
        minBid: range.minBid,
        midBid: range.midBid,
        maxBid: range.maxBid,
        bidInput: range.bidInput,
        status: range.status,
        createdAt: range.createdAt
      }));
    } catch (error) {
      throw new Error(`Có lỗi xảy ra khi lấy thông tin sản phẩm hoặc giá thầu: ${error.message}`);
    }
  },


  getProductAuctionAdmin: async () => {
    try {
      // Bước 1: Tìm tất cả sản phẩm có status khác 'disable', populate 'product_format'
      const products = await Product_v2.find({ status: { $ne: 'disable' } })
       // Populate để lấy thông tin từ collection 'formatshoppings'

      // Bước 2: Lọc ra các sản phẩm có product_format là 'Đấu giá'
      const filteredProducts = products.map(product => {
        return {
          _id: product._id,
          product_price_unit: product.product_price_unit,
          product_name: product.product_name,
          image: product.image
        };
      });

      return filteredProducts;
    } catch (error) {
      console.error('Error in getProductAuctionAdmin service:', error);
      throw new Error(`Error retrieving products: ${error.message}`);
    }
  },

  getAllPriceRange: async (page = 1, pageSize = 5, search ) => {
    try {
      // const skip = (page - 1) * pageSize;
      const priceRange = await PriceRangeBid.find({ status: "active" })
      .select("product_randBib minBid midBid maxBid bidInput status")
      .populate("product_randBib" , "productId", "product_price_unit", "product_name") // Chỉ lấy các trường cần thiết từ TimeTrack
      .lean();
    
      const productIds = priceRange.map((priceRange) => priceRange.product_randBib.productId);
   
      
      const products = await Product_v2.find({
        _id: { $in: productIds }, status: "active"
      },)
        .select("_id image product_name ")
    
        .lean();

     

      // Bước 3.1: Lọc các sản phẩm có product_format.formats là 'Đấu giá'
    

      // Bước 4: Tạo map productId -> product để dễ dàng truy cập
      const productMap = {};
      products.forEach((product) => {
        productMap[product._id] = product;
      });

      const matchedPriceRandge = priceRange.map(priceRange => {
        const productIdStr = priceRange.product_randBib?.productId?.toString(); // Chuyển ObjectId thành chuỗi
        const product = productMap[productIdStr]; // Lấy thông tin sản phẩm từ productMap

        // Nếu sản phẩm tồn tại, kết hợp thông tin từ timeTrack và product
        if (product) {
          return {
            ...priceRange, // Thêm thông tin timeTrack
            product // Thêm thông tin sản phẩm
          };
        }
        return null; // Trả về null nếu không tìm thấy sản phẩm
      }).filter(track => track !== null); // Lọc các phần tử null
  
      
      const allPriceRand = matchedPriceRandge.map(track => ({
        priceRandId: track._id,
       
        productId: track.product._id,
        productName: track.product.product_name,
        image: track.product.image, // Lấy hình ảnh từ sản phẩm
      
      }));

    
      
      const searchResults = search
      ? matchedPriceRandge.filter((priceRange) => {
          const productName = priceRange.product.product_name.toLowerCase();
          return productName.includes(search.toLowerCase());
        })
      : matchedPriceRandge;
      const totalItems = searchResults.length; // Tổng số mục sau khi lọc
      const totalBuckets = Math.ceil(totalItems / pageSize); // Tổng số bucket
      const bucket = Math.min(totalBuckets, page); // Chỉ số bucket hiện tại
      const paginatedResults = searchResults.slice((bucket - 1) * pageSize, bucket * pageSize); // Lấy dữ liệu của bucket
  
      // Bước 8: Tính toán tổng số trang
      const totalPages = totalBuckets;

      return {
        priceRanges: paginatedResults,
        totalPages: totalPages,
        currentPage: bucket,
        allPriceRand, // Trả về danh sách hình ảnh
      };

    } catch (error) {
      throw new Error(`Có lỗi xảy ra khi lấy danh sách đấu giá: ${error.message}`);
    }
  },

  editPriceRange: async (priceRangeBidId, bidInput) => {
    try {
      // Tìm kiếm bản ghi priceRangeBid theo ID
      const priceRangeBid = await PriceRangeBid.findById(priceRangeBidId);

      if (!priceRangeBid) {
        throw new Error("Không tìm thấy bản ghi priceRangeBid.");
      }

      // Kiểm tra bidInput phải bằng với product_price_unit
      if (bidInput !== priceRangeBid.product_randBib.product_price_unit) {
        throw new Error("bidInput phải bằng với product_price_unit.");
      }

      // Cập nhật giá trị minBid, midBid, maxBid
      const minBid = bidInput;
      const midBid = minBid + minBid * 0.03;
      const maxBid = midBid + midBid * 0.04;

      priceRangeBid.minBid = minBid;
      priceRangeBid.midBid = midBid;
      priceRangeBid.maxBid = maxBid;
      priceRangeBid.bidInput = bidInput;

      // Lưu bản ghi priceRangeBid đã được cập nhật
      const updatedBid = await priceRangeBid.save();
      return updatedBid;
    } catch (error) {
      throw new Error(`Có lỗi xảy ra khi chỉnh sửa đấu giá: ${error.message}`);
    }
  },
  softDeletePriceRangeBid: async (id) => {
    try {
      const nowUtc = new Date();
    
      // Chuyển đổi thời gian UTC về múi giờ Việt Nam
      // Múi giờ Việt Nam là UTC + 7 giờ
      const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
      const now = new Date(nowUtc.getTime() + offset);
      // Tìm kiếm và cập nhật bản ghi priceRangeBid theo ID
      const updatedBid = await PriceRangeBid.findByIdAndUpdate(
        id,
        { status: "disable" , disabledAt: now, },
        { new: true } // Trả về bản ghi đã được cập nhật
      );

      if (!updatedBid) {
        throw new Error("Không tìm thấy bản ghi priceRangeBid.");
      }

      // Kiểm tra trạng thái trước khi cập nhật
   

      return updatedBid;
    } catch (error) {
      throw new Error(`Có lỗi xảy ra khi xóa mềm đấu giá: ${error.message}`);
    }
  },

  restorePriceRangeBid: async (id) => {
    try {
      // Tìm kiếm và cập nhật bản ghi priceRangeBid theo ID
      const updatedBid = await PriceRangeBid.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
      );

      if (!updatedBid) {
        throw new Error("Không tìm thấy bản ghi priceRangeBid.");
      }

      // Kiểm tra trạng thái trước khi cập nhật
    

      return updatedBid;
    } catch (error) {
      throw new Error(`Có lỗi xảy ra khi khôi phục đấu giá: ${error.message}`);
    }
  },
  getDeletedPriceRangeBid: async (
    page = 1, pageSize = 5, search
  ) => {
    try {
  
      const priceRangeDelted = await PriceRangeBid.find({ status: "disable" })
      .select("product_randBib minBid midBid maxBid bidInput status")
      .populate("product_randBib" , "productId", "product_price_unit", "product_name") // Chỉ lấy các trường cần thiết từ TimeTrack
      .lean();

      
      const productIds = priceRangeDelted.map((rnas) => rnas.product_randBib.productId);
    
      
      const productsRandBid = await Product_v2.find({
        _id: { $in: productIds }, status: "disable"
      })
        .select("_id image product_name")
        .lean();


      

      // Bước 3.1: Lọc các sản phẩm có product_format.formats là 'Đấu giá'
    

      // Bước 4: Tạo map productId -> product để dễ dàng truy cập
      const productMap = {};
      productsRandBid.forEach((product) => {
        productMap[product._id] = product;
      });

      const matchedPriceRandge = priceRangeDelted.map(priceRange => {
        const productIdStr = priceRange.product_randBib.productId.toString(); // Chuyển ObjectId thành chuỗi
        const product = productMap[productIdStr]; // Lấy thông tin sản phẩm từ productMap

        // Nếu sản phẩm tồn tại, kết hợp thông tin từ timeTrack và product
        if (product) {
          return {
            ...priceRange, // Thêm thông tin timeTrack
            product // Thêm thông tin sản phẩm
          };
        }
        return null; // Trả về null nếu không tìm thấy sản phẩm
      }).filter(track => track !== null); // Lọc các phần tử null

      const allPriceRand = matchedPriceRandge.map(track => ({
        priceRandId: track._id,
       
        productId: track.product._id,
        productName: track.product.product_name,
        image: track.product.image, // Lấy hình ảnh từ sản phẩm
      
      }));

      const searchResults = search
      ? matchedPriceRandge.filter((priceRange) => {
          const productName = priceRange.product.product_name.toLowerCase();
          return productName.includes(search.toLowerCase());
        })
      : matchedPriceRandge;
      const totalItems = searchResults.length; // Tổng số mục sau khi lọc
      const totalBuckets = Math.ceil(totalItems / pageSize); // Tổng số bucket
      const bucket = Math.min(totalBuckets, page); // Chỉ số bucket hiện tại
      const paginatedResults = searchResults.slice((bucket - 1) * pageSize, bucket * pageSize); // Lấy dữ liệu của bucket
  
      // Bước 8: Tính toán tổng số trang
      const totalPages = totalBuckets;

      return {
        priceRanges: paginatedResults,
        totalPages: totalPages,
        currentPage: bucket,
        allPriceRand, // Trả về danh sách hình ảnh
      };

    } catch (error) {
      throw new Error(`Có lỗi xảy ra khi lấy danh sách đấu giá: ${error.message}`);
    }
  }
};

module.exports = pricRangeBidService;
