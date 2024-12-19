import React, { useEffect, useState,useRef ,useMemo} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store";
import { fetchBidsByUserThunk } from "../../../../redux/bidding/biddingThunk";
import { completeAuction  } from "../../../../redux/auctions/auctionThunk";
import { clearCompletedAuction } from "../../../../redux/bidding/biddingSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bid } from "../../../../types/bidding/bidding";
// import { BiddingActive } from "../../../../types/listBiddings/listBidActive";
import { parseISO } from "date-fns";
import EditModalPopUp from "./modalEditAmout";
import DeleteBidModal from "./deleteBid";
import BidGroup from "./bidGroup";
import {   useNavigate} from "react-router-dom";
import { fetchListBidActive } from "../../../../redux/listBidActive/listbidActiveThunk";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import { clearProductBidding } from "../../../../redux/listBidActive/listBidActivveSlice";
import { clearAuctionData } from "../../../../redux/aucCheckout/auctCheckoutSlice";
export interface Auction {
  _id:string
    productId: string;
    auctionEndTime: string; // Time when auction ends
    auction_winner: string | null; // Winner of the auction, null if no winner
    auction_quantity: number; // Number of bids
    auction_total: number; // Total amount of all bids
    auctionTime: Date; // Auction start time
    biddings: string[]; // Array of bidding IDs
    stateAuction: string; // Auction state (e.g., "confirmed", "in-progress")
    isActive: boolean; // Is the auction still active?
  }
const ViewBidPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id);



  
  // const aucttionData = useSelector((state: RootState) => state.auction.auction?.auction_winner);




  
  const bids = useSelector((state: RootState) => state.bidding.bids) || [];
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [canEdit, setCanEdit] = useState<{ [key: string]: boolean }>({});
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bidToDelete, setBidToDelete] = useState<Bid | null>(null);
  const [stats, setStats] = useState<{ [key: string]: { averageBid: number, totalBids: number, totalPayment: number } }>({});
  // const [completedAuctionAmount, setCompletedAuctionAmount] = useState<number | null>(null); // Add state for completed auction amount
  // const [completedAuctions, ] = useState<Set<string>>(new Set()); // Track completed auctions

  const completedAuctionsRef = useRef<Set<string>>(new Set());
  const navigate = useNavigate();
  const { BiddingActive, totalPages } = useSelector(
    (state: RootState) => state.listBidActive
  );



  const [pageActive, setPage] = useState(1);
  const [pageSizeActive] = useState(5);
  const [searchActive] = useState("");

  useEffect(() => {
    dispatch(fetchListBidActive({ pageActive, pageSizeActive, searchActive }));
  }, [dispatch, pageActive, pageSizeActive, searchActive]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (userId) {

      dispatch(fetchBidsByUserThunk(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    const checkEditPermissions = () => {
      const updatedCanEdit = { ...canEdit };

      bids.forEach((bid: Bid) => {
        const endTime = bid.bidEndTime?.endTimeBid ? parseISO(bid.bidEndTime.endTimeBid) : null;
        if (endTime) {
          const fifteenMinutes = 15 * 60 * 1000;
          updatedCanEdit[bid._id] = endTime.getTime() - currentTime.getTime() > fifteenMinutes;
        } else {
          updatedCanEdit[bid._id] = false;
        }
      });

      setCanEdit(updatedCanEdit);
    };

    checkEditPermissions();
  }, [bids, currentTime]);

  useEffect(() => {
    const calculateStats = () => {
      const productStats: { [key: string]: { totalBids: number, totalAmount: number } } = {};

      bids.forEach(bid => {
      
        const productId = bid.product_bidding?.productId?.product_name;
        if (productId) {
          if (!productStats[productId]) {
            productStats[productId] = { totalBids: 0, totalAmount: 0 };
          }
          productStats[productId].totalBids += 1;
          productStats[productId].totalAmount += bid.bidAmount;
        }
      });

      const stats = Object.keys(productStats).reduce((acc, productId) => {
        const { totalBids, totalAmount } = productStats[productId];
        const averageBid = totalAmount / totalBids;
        acc[productId] = { averageBid, totalBids, totalPayment: totalAmount };
        return acc;
      }, {} as { [key: string]: { averageBid: number, totalBids: number, totalPayment: number } });

      setStats(stats);
    };

    calculateStats();
  }, [bids]);

  const openEditModal = (bid: Bid) => {
    setSelectedBid(bid);
  };

  const openDeleteModal = (bid: Bid) => {
    setBidToDelete(bid);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBidToDelete(null);
  };

  const handleDelete = () => {
    closeDeleteModal();
    dispatch(fetchBidsByUserThunk(userId!));
  };

  const groupBidsByProduct = (bids: Bid[]) => {
    return bids.reduce((acc, bid) => {
      const productId = bid.product_bidding?.productId?._id; // Lấy productId từ bid
      if (productId) {
        if (!acc[productId]) {
          acc[productId] = []; // Nếu chưa có nhóm đấu giá cho productId này, tạo mới
        }
        acc[productId].push(bid); // Thêm bid vào nhóm tương ứng
      }
      return acc;
    }, {} as Record<string, Bid[]>); // Trả về một đối tượng nhóm theo productId
  };
  

  const groupedBids = useMemo(() => groupBidsByProduct(bids), [bids]);
 

  const bidGroups = Object.values(groupedBids);
const completAuction = async (productId: string, timeTrackID: string) => {
  await dispatch(completeAuction({ productId, timeTrackID }));

}
  const handleCompleteAuction = async (productId: string, timeTrackID: string) => {
  // Chặn request nếu đang xử lý
   

    if (completedAuctionsRef.current.has(productId)) {
      return; // Skip if auction is already completed
    }

    if(!userId){
      toast.error("Bạn chưa có tài khoản");
      return
    }
    const currentBidGroup = groupedBids[productId];
    if (!currentBidGroup) {
      toast.error("Không tìm thấy nhóm đấu giá này");
      return;
    }
    if (BiddingActive.length === 1) {
      // Trường hợp chỉ có 1 user
      const singleWinner = BiddingActive[0];

    
      const singleWinnerOne = singleWinner.product_bidding.productId;

      // setTimeout(() => {
      //   toast.success("Chúc mừng bạn!",)
      // }, 2000); // Delay of 2000 milliseconds (2 seconds)
      await completAuction(singleWinnerOne, timeTrackID);
      completedAuctionsRef.current.add(singleWinnerOne); // Đánh dấu đã xử lý
      dispatch(clearProductBidding(singleWinnerOne));
      dispatch(clearCompletedAuction(singleWinnerOne));
      navigate('/checkoutAuc');
 
     
    } else if (BiddingActive.length > 1) {
      // Trường hợp nhiều user nhưng cùng mức giá
      // Kiểm tra xem các user có cùng mức giá hay không
      const allBidsWithSamePrice = BiddingActive.every(
        (bid) => bid.bidAmount === BiddingActive[0].bidAmount
      );
    
      if (allBidsWithSamePrice) {
        // Nếu tất cả user có mức giá giống nhau, chọn user bid sớm nhất
        const bidsWithTimes = BiddingActive.map(bid => ({
          ...bid,
          bidTimeTimestamp: new Date(bid.bidTime).getTime(), // Convert bidTime to timestamp
        }));
    
        
        // const currentTime = Date.now(); // Current timestamp in milliseconds
        
        // // Use reduce to find the bid closest to the current time
        // const closestBid = bidsWithTimes.reduce((earliest, current) => {
        //   const timeDiffEarliest = Math.abs(earliest.bidTimeTimestamp - currentTime);
        //   const timeDiffCurrent = Math.abs(current.bidTimeTimestamp - currentTime);
        
        //   return timeDiffCurrent < timeDiffEarliest ? current : earliest;
        // });

        // console.log('closestBid', closestBid);
        
    
        // const earliestBid = closestBid; // User bid sớm nhất
    
       const userErlyBid = bidsWithTimes[0].biddingUserObj._id;
    
        // const otherBids = BiddingActive.filter(bid => bid._id !== closestBid._id);
        // console.log('others', otherBids);
    
        const productIdEra = bidsWithTimes[0].product_bidding.productId;
      
        // const groupBId =  otherBids.map((bid) => {
        //   return {
        //     productIdBis: bid.product_bidding.productId,
        //     userOtherBid: bid.biddingUserObj._id,
        //   };
        // })

        // console.log('groupBId', groupBId);
        
        // const userGroupBid = groupBId[0].userOtherBid
        // const productGroupBId =  groupBId[0].productIdBis
        if(userErlyBid === userId){
          // toast.success("Chúc mừng bạn!", {
                      //   onClose: () => 
                      // });
                      // Complete the auction for the winner
                      await  completAuction(productIdEra, timeTrackID);
                     
                      dispatch(clearCompletedAuction(productIdEra));
                      dispatch(clearProductBidding(productIdEra));
                      navigate('/checkoutAuc')
                   
              }else {
                navigate('/')
                dispatch(clearAuctionData());
              }
    //     if(userGroupBid !== userId){
    // // toast.success("Hãy thử lại lần sau!", {
    //           //   onClose: () => 
    //           // });
    //          
    //           // If it's not the logged-in user, clear their bidding data
    //           dispatch(clearProductBidding(productGroupBId));
    //           dispatch(clearCompletedAuction(productGroupBId));
    //         
    //     }
        // Clear dữ liệu của những user không thắng
   
    
        // Handle the case where the logged-in user is the winner
  
    
      } else {
        // Trường hợp có user với mức giá khác nhau, xử lý logic của bạn
        // Ví dụ: Chọn người thắng với mức giá cao nhất
        const highestBid = BiddingActive.reduce((prev, current) =>
          prev.bidAmount > current.bidAmount ? prev : current
        );

        const hidghBids = highestBid.product_bidding.productId;
  
        
        const hidghBidsUserID = highestBid.biddingUserObj._id;

        
        const otherBidsElf = BiddingActive.filter(bid => bid.biddingUserObj._id !== highestBid.biddingUserObj._id);
  
        const endOfBids = otherBidsElf.map((bid) => {
          return {
            productIdBis: bid.product_bidding.productId,
            userOtherBid: bid.biddingUserObj._id,
          };
        });
    
 
        
        const productEndOfBid = endOfBids[0].productIdBis

        if (hidghBidsUserID === userId){
          // toast.success("Chúc mừng bạn!", {
               //   onClose: () => 
               // });
              await completAuction(hidghBids, timeTrackID);
                completedAuctionsRef.current.add(hidghBids );
                dispatch(clearProductBidding(hidghBids));
                dispatch(clearCompletedAuction(hidghBids));
                navigate('/checkoutAuc')
            
             }else {
              navigate('/')
              dispatch(clearAuctionData());
                  dispatch(clearProductBidding(productEndOfBid));
          dispatch(clearCompletedAuction(productEndOfBid));
             }

  

    
      }
    
    } else {
      console.warn("Không có user nào tham gia đấu giá");
    }

    
  };
  // const completeAuctionForMultipleBidders = async (bids: Bid[], productId: string, timeTrackID: string) => {
  //   // Kiểm tra xem những người tham gia có cùng mức giá hay không
  //   const allBidsWithSamePrice = bids.every(bid => bid.bidAmount === bids[0].bidAmount);
  
  //   if (allBidsWithSamePrice) {
  //     // Nếu tất cả có mức giá giống nhau, chọn người đặt bid sớm nhất
  //     const winnerBid = bids.reduce((earliest, current) => {
  //       return new Date(current.bidTime).getTime() < new Date(earliest.bidTime).getTime() ? current : earliest;
  //     });
  
  //     // Hoàn tất đấu giá cho người thắng
  //     if (winnerBid.bidder === userId) {
  //       await completAuction(productId, timeTrackID);
  //       completedAuctionsRef.current.add(productId);
  //       dispatch(clearProductBidding(productId));
  //       dispatch(clearCompletedAuction(productId));
  //       navigate("/checkoutAuc");
  //     } else {
  //       dispatch(clearProductBidding(productId));
  //       dispatch(clearCompletedAuction(productId));
  //       dispatch(clearAuctionData());
  //       navigate("/");
  //     }
  //   }else {
  //     const highestBid = bids.reduce((max, current) => {
  //       return current.bidAmount > max.bidAmount ? current : max;
  //     });
  
  //     // Hoàn tất đấu giá cho người thắng với mức giá cao nhất
  //     if (highestBid.bidder === userId) {
  //       await completAuction(productId, timeTrackID);
  //       completedAuctionsRef.current.add(productId);
  //       dispatch(clearProductBidding(productId));
  //       dispatch(clearCompletedAuction(productId));
  //       navigate("/checkoutAuc");
  //     } else {
  //       // Nếu người tham gia không thắng, xóa thông tin đấu giá và quay lại trang chủ
  //       dispatch(clearProductBidding(productId));
  //       dispatch(clearCompletedAuction(productId));
  //       dispatch(clearAuctionData());
  //       navigate("/");
  //     }
  //   }
  // };
  // const completeAuctionForSingleBidder = async (bid: Bid, timeTrackID: string) => {
  //   // Logic hoàn thành đấu giá với một người tham gia
  //   const productId = bid.product_bidding?.productId?._id;
  //   await completAuction(productId, timeTrackID);
  //   completedAuctionsRef.current.add(productId);
  //   dispatch(clearProductBidding(productId));
  //   dispatch(clearCompletedAuction(productId));
  //   navigate("/checkoutAuc");
  // };
  const formatDateVN = (dateString: string) => {
    const date = new Date(dateString); // Chuyển đổi chuỗi thành đối tượng Date
    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh", // Thiết lập múi giờ
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };
  return (
    <div className="min-h-[calc(71vh-10rem)] container lg:col-span-8 border border-gray-200 p-4 rounded-lg shadow-sm bg-white mb-16 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800"> Lượt đấu giá</h2>
          {/* <Link to={'/profile'}
           
            className="bg-indigo-500 text-white py-1 px-4 rounded-lg shadow 
            hover:bg-blue-600 transition duration-200"
          >
              Lịch sử lượt đấu giá
          </Link> */}
          
          </div>
          <br />
          <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white mb-16">
        
       
         

            <div className="space-y-8">
              {bidGroups.length > 0 ? (
                bidGroups.map((bidsGroup: Bid[]) => (
                  <BidGroup
                    key={bidsGroup[0]._id}
                    bidsGroup={bidsGroup}
                    canEdit={canEdit}
                    openEditModal={openEditModal}
                    openDeleteModal={openDeleteModal}
                    
                    handleCompleteAuction={handleCompleteAuction}
                  />
                ))
              ) : (
                <p className="text-gray-600">Không có lượt đấu giá nào.</p>
              )}
            </div>
           
          </div>

          <div className="border border-gray-200 p-4 
          rounded-lg shadow-sm bg-white mb-16">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tổng số lượt đấu giá</h2>
              <div className="space-y-8">
              <div className="py-5 relative">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    Hình ảnh
                  </th>
                  <th scope="col" className="p-4">
                    Tên sản phẩm
                  </th>
                  <th scope="col" className="p-4">
                    Người dùng
                  </th>
                  <th scope="col" className="p-4">
                    Giá
                  </th>
                  <th scope="col" className="p-4">
                    Thời gian{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {BiddingActive && BiddingActive.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  BiddingActive?.map((trackBid) => (
                    <tr
                      key={trackBid._id}
                      className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center mr-3">
                          <img
                            src={trackBid.product.image[0]}
                            alt={trackBid.product.product_name}
                            className="h-12 w-12 object-cover mr-3"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {trackBid.product.product_name}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {trackBid.biddingUserObj.name}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {trackBid.bidAmount.toLocaleString()} VNĐ
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {formatDateVN(trackBid.bidTime)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaginationComponent
        currentPage={pageActive}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
              </div>
          </div>
        </div>

        <div className="md:col-span-1 bg-white border border-gray-500 p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sổ lệnh</h2>
          {Object.entries(stats).map(([productId, {averageBid,  totalBids, totalPayment }]) => (
            <div key={productId} className="mb-4">
              <h3 className="text-md font-medium text-gray-700">Sản phẩm: {productId}</h3>
              <p className="text-gray-600">Trung bình giá đấu: { Math.floor(averageBid).toLocaleString()} đ</p>
              <p className="text-gray-600">Tổng số lượt đấu giá: {totalBids}</p>
              <p className="text-gray-600">Tổng thanh toán: {totalPayment.toLocaleString()} đ</p>
            </div>
          ))}
          {/* {completedAuctionAmount !== null && (
            <div className="mt-4 p-4 bg-green-100 rounded-md">
              <p className="text-lg font-semibold">Tổng số tiền hoàn thành đấu giá:</p>
              <p className="text-xl font-bold">{completedAuctionAmount.toLocaleString()} đ</p>
            </div>
          )} */}
        </div>
      </div>

      {/* Edit and Delete Modals */}
      {selectedBid && (
        <EditModalPopUp
          productId={selectedBid.product_bidding?.productId._id}
          bid={selectedBid}
          onClose={() => setSelectedBid(null)}
        />
      )}
{bidToDelete && (
  <DeleteBidModal
    bidId={bidToDelete._id}
    onClose={closeDeleteModal}
    onDelete={handleDelete}
    isOpen={isDeleteModalOpen}
  />
)}




      <ToastContainer />
    </div>
  );
};

export default ViewBidPage;
