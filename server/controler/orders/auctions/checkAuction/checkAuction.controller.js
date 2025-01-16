const AuctionPricingRange = require("../../../../model/productAuction/auctionPricingRange"); // Đường dẫn đến model
const ProductAuction = require("../../../../model/productAuction/productAuction");
const AuctiomWinner = require("../../../../model/productAuction/auctionWinner");
const User = require("../../../../model/users.model");
// const AuctionRound = require("../../../../model/productAuction/auctionRound");
const {
  sendMailPenDingToWinner,
} = require("../mailer/mailerCheckWinnerAuct/mailerPendingToWinner");
const {
  sendMailWinnerDel,
} = require("../mailer/mailerCheckWinnerAuct/maillerWinnerDis");
const AuctionWinnerReetirn = require("../../../../model/productAuction/auctionWinnerReturm");
const checkAuctionCOntroller = {
  getCheckWonUser: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;
      const search = req.query.search || "";

      // Fetch price range with active status
      const priceRangeWinnwe = await AuctiomWinner.find({ status: "disabled", notWinner: true })
        .select("user bidPrice status auctionStatus auctionStausCheck endTime emailSent")
        .lean();

      const userIds = priceRangeWinnwe.map((auctWin) => auctWin.user);

      // Fetch active products that are in the price range
      const auctWinnerCheck = await User.find({
        _id: { $in: userIds },
        status:'active'
      })
        .select("_id name phone email")
        .lean();

      // Map products to a productMap for easier access
      const productMap = {};
      auctWinnerCheck.forEach((product) => {
        productMap[product._id] = product;
      });

      // Combine price range with product data
      const matchedPriceRandge = priceRangeWinnwe
        .map((priceRange) => {
          const productIdStr = priceRange.user.toString(); // Convert ObjectId to string
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
        (a, b) => b.bidPrice - a.bidPrice
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
        message: "Lấy danh sách người chiến thắng thành công",
        data: {
          auctWinnerCheck: paginatedResultsWithIndex, // Return the paginated results with serial numbers
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
  formatCustomId: (id) => {
    if (typeof id !== "string" || id.length < 4) {
      throw new Error(
        "ID không hợp lệ. Vui lòng cung cấp một chuỗi có ít nhất 4 ký tự."
      );
    }
    const lastFourChars = id.slice(-4).toUpperCase(); // Lấy 4 ký tự cuối và viết hoa
    return `EBIDW-${lastFourChars}`;
  },
  getDetailCheckWinnerAuct: async (req, res) => {
    try {
      const { id } = req.params;

      const auctionWinnerInfo = await AuctiomWinner.findOne({
        _id: id,
        status: "disabled",
      })
        .select(
          "user bidPrice status auctionStatus endTime auctionStausCheck auctionPricingRange"
        ) // Populating userID inside shippingAddress
        .exec();

      if (!auctionWinnerInfo) throw new Error("Đơn hàng không tồn tại");
      const inForUser = auctionWinnerInfo.user;
      // Find order details related to the order
      const userInforWinnerAuct = await User.findOne({
        _id: inForUser,
          status:'active'
      }).lean();

      const productDetail = await ProductAuction.findOne({
        auctionPricing: auctionWinnerInfo.auctionPricingRange,
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
        winnerPrice: auctionWinnerInfo.bidPrice,

        state: auctionWinnerInfo.auctionStausCheck,
        date: auctionWinnerInfo.endTime,
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

  updateStatusCheck: async (req, res) => {
    try {
      const { idWinner } = req.params;
      const { stateCheck } = req.body;

      // Các trạng thái hợp lệ
      const statusOrderFlow = [
        "Chờ duyệt",
        "Xử lý duyệt",
        "Đã duyệt hủy chiến thắng",
      ];

      const winnerCheck = await AuctiomWinner.findById(idWinner);

      if (!winnerCheck) {
        throw new Error("Đơn hàng không tồn tại.");
      }

      // Loại bỏ khoảng trắng dư thừa
      const trimmedStateCheck = stateCheck.trim();
      const currentIndex = statusOrderFlow.indexOf(
        winnerCheck.auctionStausCheck
      );
      const newIndex = statusOrderFlow.indexOf(trimmedStateCheck);

      //   if (currentIndex === -1 || newIndex === -1) {
      //     throw new Error("Trạng thái hiện tại hoặc trạng thái mới không hợp lệ.");
      //   }
      if (newIndex === currentIndex + 1) {
        const updatedStatus = await AuctiomWinner.findOneAndUpdate(
          { _id: idWinner },
          { $set: { auctionStausCheck: trimmedStateCheck } },
          { new: true }
        );


        // Nếu trạng thái hiện tại là "Đã duyệt hủy chiến thắng"
        if (updatedStatus.auctionStausCheck === "Đã duyệt hủy chiến thắng") {
          const auctionCheckRound = await AuctiomWinner.find({
            auctionRound: updatedStatus.auctionRound, notWinner:true
          });
      
          
          const checkVariable = auctionCheckRound[0].auctionStausCheck;
       
          
          if (checkVariable === "Đã duyệt hủy chiến thắng") {
            const winnerSetUp = await AuctiomWinner.findOne({
              _id: auctionCheckRound[0]._id,notWinner:true
            }).lean();
     
            const winnerSetUpId = winnerSetUp._id;
            const winnnerBidPrice = winnerSetUp.bidPrice;
            const converPrice = winnnerBidPrice.toLocaleString("vi-VN");
            const wiinerUser = winnerSetUp.user;
            const winnerPriceRand = winnerSetUp.auctionPricingRange;
            await AuctiomWinner.findByIdAndUpdate(
              {
                _id: winnerSetUpId,
              },
              { $set: { auctionStatus: "lose", status: "disabled" , confirmationStatus:'canceled'} },
              { new: true }
            );

            const auctWinnerCheck = await User.findOne({
              _id: wiinerUser,
                status:'active'
            })
              .select("_id name phone email")
              .lean();

            const emailWinner = auctWinnerCheck.email;
            const productWinnser = await ProductAuction.findOne({
              auctionPricing: winnerPriceRand,
            }).lean();

            const winnserProductDetail = {
              productName: productWinnser.product_name,
              productPrice: converPrice,
              quantity: 1,
              image: productWinnser.image[0],
            };
            sendMailWinnerDel(emailWinner, winnerSetUpId, winnserProductDetail);
 
       

            const auctionCheckRoundTwo = await AuctiomWinner.find({
              auctionRound: winnerCheck.auctionRound, notWinner:true
            });
        
            
            
            if (auctionCheckRoundTwo.length >= 2) {
              const bidPriceOne = auctionCheckRoundTwo[0];
              const bidPriceTwo = auctionCheckRoundTwo[1];
              if (bidPriceOne.bidPrice > bidPriceTwo.bidPrice) {
                const checkVariableTwo =
                  auctionCheckRoundTwo[1].auctionStausCheck;

                if (checkVariableTwo === "Chờ duyệt") {
                  const winnerSetUpTwo = await AuctiomWinner.findOne({
                    _id: auctionCheckRoundTwo[1]._id,
                  }).lean();

                

                  const winnerSetUpId = winnerSetUpTwo._id;
                  const winnerSetUpPrice = winnerSetUpTwo.bidPrice;
                  const converPrice = winnerSetUpPrice.toLocaleString("vi-VN");
                  const wiinerUser = winnerSetUpTwo.user;
                  const winnerPriceRand = winnerSetUpTwo.auctionPricingRange;
                  await AuctiomWinner.findByIdAndUpdate(
                    {
                      _id: winnerSetUpId,
                    },
                    { $set: { auctionStatus: "won" } },
                    { new: true }
                  );

                  const auctWinnerCheck = await User.findOne({
                    _id: wiinerUser,
                    status:'active'
                  })
                    .select("_id name phone email")
                    .lean();

                  const emailWinner = auctWinnerCheck.email;
                  const productWinnser = await ProductAuction.findOne({
                    auctionPricing: winnerPriceRand,
                  }).lean();

                  const winnserProductDetail = {
                    productName: productWinnser.product_name,
                    productPrice: converPrice,
                    quantity: 1,
                    image: productWinnser.image[0],
                  };
                  sendMailPenDingToWinner(
                    emailWinner,
                    winnerSetUpId,
                    winnserProductDetail
                  );
                }
                // Xử lý logic khi bidPriceTwo nhỏ hơn bidPriceOne
              }

              if (bidPriceTwo.status === 'disabled') {
                const checkVariableTwo =
                  auctionCheckRoundTwo[1].auctionStausCheck;

                if (checkVariableTwo === "Đã duyệt hủy chiến thắng") {
                  const winnerSetUpTwo = await AuctiomWinner.findOne({
                    _id: auctionCheckRoundTwo[1]._id,
                  }).lean();

                

                  const winnerSetUpId = winnerSetUpTwo._id;
              

              
                  await Promise.all([
                     AuctiomWinner.findByIdAndUpdate(
                      {
                        _id: winnerSetUpId,
                      },
                      { $set: {auctionStatus : "lose", auctionStausCheck: "Đã duyệt hủy chiến thắng" } },
                      { new: true }
                    ),
              
                  ]);
             
            
                }
                // Xử lý logic khi bidPriceTwo nhỏ hơn bidPriceOne
              }
            

              if (
                bidPriceOne.auctionStatus === "lose" &&
                bidPriceTwo.auctionStatus === "lose"
              ) {
                console.log(
                  "Cả bidPriceOne và bidPriceTwo đều có aucTionStatus là 'lose'. Hủy phiên đấu giá."
                );
                await Promise.all([
                  AuctiomWinner.findOneAndUpdate(
                    {
                      auctionPricingRange: winnerCheck.auctionPricingRange,
                    },
                    { $set: { status: "delete" } }
                  ),
                  ProductAuction.findOneAndUpdate(
                    {
                      auctionPricing: winnerCheck.auctionPricingRange,
                    },
                    { $set: { status: "disable" } }
                  ),
                ]);

                return res.status(200).json({
                  msg: "Phiên đấu giá đã bị hủy do cả hai bidPrice đều có trạng thái 'lose'.",
                  success: true,
                  status: 200,
                });
              }
            } else {
              console.log("auctionCheckRoundTwo không đủ dữ liệu để so sánh");
            }
          }
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

module.exports = checkAuctionCOntroller;
