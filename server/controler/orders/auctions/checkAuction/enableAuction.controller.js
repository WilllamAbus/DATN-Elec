 // Đường dẫn đến model
const ProductAuction = require("../../../../model/productAuction/productAuction");
const AuctiomWinner = require("../../../../model/productAuction/auctionWinner");
const User = require("../../../../model/users.model");
const auctionReturn = require("../../../../model/productAuction/auctionWinnerReturm");
const {
  sendMaiBlock,
} = require("../mailer/mailerCheckWinnerAuct/mailerBlockToUser");
const {
  sendMailEnableDel,
} = require("../mailer/mailerCheckWinnerAuct/mailerEnableToUserDis");

const enableAuctionCOntroller = {
  getEnableUser: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;
      const search = req.query.search || "";

      // Fetch price range with active status
      const priceRangeEnable = await auctionReturn
        .find({ status: "disable" })
        .select(
          "auctionWinnerReturn auctionStausIsCheck auctionWinnerUserReturn status bidPriceReturn auctionReturnStatus coundDisabledAuction"
        )
        .lean();

      const userIds = priceRangeEnable.map(
        (auctWin) => auctWin.auctionWinnerUserReturn
      );

      // Fetch active products that are in the price range
      const auctWinnerCheck = await User.find({
        _id: { $in: userIds },
   
      })
        .select("id email phone name")
        .lean();

      // Map products to a productMap for easier access
      const productMap = {};
      auctWinnerCheck.forEach((product) => {
        productMap[product._id] = product;
      });

      // Combine price range with product data
      const matchedPriceRandge = priceRangeEnable
        .map((priceRange) => {
          const productIdStr = priceRange.auctionWinnerUserReturn.toString();

          // Convert ObjectId to string
          const userWinnerAuct = productMap[productIdStr]; // Get product from productMap

          if (userWinnerAuct) {
            return {
              ...priceRange, // Include price range info
              userWinnerAuct, // Include product info
            };
          }
          return null;
        })
        .filter((track) => track !== null); // Filter out null values

      // Sort matched price range by maxPrice in descending order
      const sortedWinnerAuct = matchedPriceRandge.sort(
        (a, b) => b.bidPriceReturn - a.bidPriceReturn
      );

      // Filter by search term if provided
      const searchResults = search
        ? sortedWinnerAuct.filter((priceRange) => {
            const nameWinnerAuct = priceRange.userWinnerAuct.name.toLowerCase();
            return nameWinnerAuct.includes(search.toLowerCase());
          })
        : sortedWinnerAuct;

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
        message: "Lấy danh sách thành công",
        data: {
          auctWinnerEnable: paginatedResultsWithIndex, // Return the paginated results with serial numbers
          totalPages: totalPages,
          currentPage: page,
          allPriceRandWinner: sortedWinnerAuct, // Return the sorted full list as well
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getDetailCheckEnableAuct: async (req, res) => {
    try {
      const { id } = req.params;

      const auctionWinnerInfo = await auctionReturn
        .findOne({ _id: id, status: "disable" })
        .select(
          "auctionWinnerReturn createdAt auctionStausIsCheck auctionWinnerUserReturn status bidPriceReturn auctionReturnStatus coundDisabledAuction"
        ) // Populating userID inside shippingAddress
        .exec();

      if (!auctionWinnerInfo) throw new Error("Dữ liệu không tồn tại");
      const inForUser = auctionWinnerInfo.auctionWinnerUserReturn;
      // Find order details related to the order
      const userInforWinnerAuct = await User.findOne({
        _id: inForUser,
    
      }).lean();

      const auctionWinnerInformed = await AuctiomWinner.findOne({
        _id: auctionWinnerInfo.auctionWinnerReturn,
      }).lean();
      const productDetail = await ProductAuction.findOne({
        auctionPricing: auctionWinnerInformed.auctionPricingRange,
      }).lean();

      // Extract the user and address information from the shippingAddress
      const userInforWinner = {
        userId: userInforWinnerAuct._id,
        recipientName: userInforWinnerAuct.name,

        phone: userInforWinnerAuct.phone,
        email: userInforWinnerAuct.email, // Assuming the user's email is stored here
      };

      const productDetails = {
        productName: productDetail.product_name,
        productPrice: productDetail.product_price,
        quantity: 1,
        image: productDetail.image[0],
      };

      const customData = {
        userInforWinner,
        productDetails, // Contains recipient, phone, address, and user email
        winnerPrice: auctionWinnerInfo.bidPriceReturn,
        countDisabled: auctionWinnerInfo.coundDisabledAuction,
        state: auctionWinnerInfo.auctionStausIsCheck,
        date: auctionWinnerInfo.createdAt,
        auctionWinnerid: auctionWinnerInfo._id,
      };
      // Return the consolidated order information

      return res.status(200).json({
        success: true,
        status: 200,
        error: -2,
        message: "Lấy chi tiết thành công",
        data: customData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  updateStatusEnable: async (req, res) => {
    try {
      const { idEnale } = req.params;
      const { stateEnable } = req.body;

      // Các trạng thái hợp lệ
      const statusOrderFlow = [
        "Đã duyệt hủy chiến thắng",
        "Cảnh báo đầu tiên",
        "Cảnh báo cuối cùng",
        "Khóa tài khoản",
      ];

      const enableCheck = await auctionReturn.findById(idEnale);

      if (!enableCheck) {
        throw new Error("Dữ liệu không tồn tại.");
      }

      // Loại bỏ khoảng trắng dư thừa
      const trimmedStateCheck = stateEnable.trim();
      const currentIndex = statusOrderFlow.indexOf(
        enableCheck.auctionStausIsCheck
      );
      const newIndex = statusOrderFlow.indexOf(trimmedStateCheck);

  
      if (newIndex === currentIndex + 1) {
        const updatedStatus = await auctionReturn.findOneAndUpdate(
          { _id: idEnale },
          { $set: { auctionStausIsCheck: trimmedStateCheck } },
          { new: true }
        );
 

        // Nếu trạng thái hiện tại là "Đã duyệt hủy chiến thắng"
        if (updatedStatus.auctionStausIsCheck === "Cảnh báo đầu tiên") {
          const enableCountSt = updatedStatus.coundDisabledAuction + 1;
          await auctionReturn.findByIdAndUpdate(
            {
              _id: idEnale,
            },
            {
              $set: {
                coundDisabledAuction: enableCountSt,
                mess: "Tài khoản đang bị cảnh báo lần 1",
              },
            },
            { new: true }
          );
          const userMail = updatedStatus.auctionWinnerUserReturn;
          const enableAuctID = updatedStatus._id;
          const auctWinnerCheck = await User.findOne({
            _id: userMail,
    
          })
            .select("_id name phone email")
            .lean();
          const emailEnable = auctWinnerCheck.email;

          const auctionCheckRound = await AuctiomWinner.findOne({
            _id: updatedStatus.auctionWinnerReturn,
            status: "disabled",
            auctionStatus: "lose",
          });
          console.log("auction", auctionCheckRound);

          const productDetail = await ProductAuction.findOne({
            auctionPricing: auctionCheckRound.auctionPricingRange,
          }).lean();
        

          const enableBidPrice = updatedStatus.bidPriceReturn;
          const converPrice = enableBidPrice.toLocaleString("vi-VN");
       

          const enableProductDetail = {
            productName: productDetail.product_name,
            productPrice: converPrice,
            quantity: 1,
            image: productDetail.image[0],
          };

          sendMailEnableDel(emailEnable, enableAuctID, enableProductDetail);
        }

        if (updatedStatus.auctionStausIsCheck === "Cảnh báo cuối cùng") {
          const enableCountNd = 3;
          await auctionReturn.findByIdAndUpdate(
            {
              _id: idEnale,
            },
            {
              $set: {
                coundDisabledAuction: enableCountNd,
                mess: "Tài khoản đang bị cảnh báo ",
              },
            },
            { new: true }
          );

          const userMail = updatedStatus.auctionWinnerUserReturn;
          const enableAuctID = updatedStatus._id;
          const auctWinnerCheck = await User.findOne({
            _id: userMail,
        
          })
            .select("_id name phone email")
            .lean();
          const emailEnable = auctWinnerCheck.email;

          const auctionCheckRound = await AuctiomWinner.findOne({
            _id: updatedStatus.auctionWinnerReturn,
            status: "disabled",
            auctionStatus: "lose",
          });

          const productDetail = await ProductAuction.findOne({
            auctionPricing: auctionCheckRound.auctionPricingRange,
          }).lean();
          const enableBidPrice = updatedStatus.bidPriceReturn;
          const converPrice = enableBidPrice.toLocaleString("vi-VN");
          const enableProductDetail = {
            productName: productDetail.product_name,
            productPrice: converPrice,
            quantity: 1,
            image: productDetail.image[0],
          };

          sendMailEnableDel(emailEnable, enableAuctID, enableProductDetail);
        }

        if (updatedStatus.auctionStausIsCheck === "Khóa tài khoản") {
          const enableCountRd = 4;
          await auctionReturn.findByIdAndUpdate(
            {
              _id: idEnale,
            },
            {
              $set: {
                coundDisabledAuction: enableCountRd,
                mess: "Khóa tài khoản ",
              },
            },
            { new: true }
          );
          const userMail = updatedStatus.auctionWinnerUserReturn;
     
          const auctWinnerCheck = await User.findOne({
            _id: userMail,
         
          })
            .select("_id name phone email")
            .lean();
          const emailEnable = auctWinnerCheck.email;

          sendMaiBlock(emailEnable);

          await Promise.all([
            User.findByIdAndUpdate(
              {
                _id: userMail,
              },
              { $set: { status: "disabled" } },
              { new: true }
            ),
       
          ]);
        }
        // Chuyển trạng thái tiếp theo

        return res.status(200).json({
          msg: `Cập nhật trạng thái đơn hàng thành công: ${trimmedStateCheck}`,
          success: true,
          status: 200,
          data: updatedStatus,
        });
      } else {
        throw new Error(
          "Không thể chuyển về trạng thái trước đó hoặc nhảy qua trạng thái."
        );
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

    softDeleteEnablCheck: async (req, res) => {
      try {
        const { id } = req.params;
        const updatedAuction = await auctionReturn.findByIdAndUpdate(
            {_id:id},
          { $set: { status: "delete" } },
          { new: true }
        );

        const productRand = updatedAuction.auctionWinnerReturn;
   
  
  
   
        // Cập nhật trạng thái của sản phẩm thành 'disable'
        const updatedProduct = await AuctiomWinner.findByIdAndUpdate(
           {_id:productRand},
           { $set: { status: "delete" } },
          { new: true }
        );
  
        if (!updatedProduct) {
          return res.status(404).json({
            error: "Không tìm thấy dữ liệu để cập nhật trạng thái",
          });
        }
        // Tìm kiếm và cập nhật `status` thành `deleted`
    
  
        // Kiểm tra nếu không tìm thấy document cần xóa mềm
     
  
        // Trả về kết quả thành công
        return res.status(200).json({
          message: "Dữ liệu được xóa thành công",
          status: "200",
          data: updatedAuction,
        });
      } catch (error) {
        console.error("Error soft deleting AuctionPricingRange:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    },
};

module.exports = enableAuctionCOntroller;
