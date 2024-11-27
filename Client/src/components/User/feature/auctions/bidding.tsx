import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store";
import { fetchBidsByUserThunk } from "../../../../redux/bidding/biddingThunk";
import { completeAuction  } from "../../../../redux/auctions/auctionThunk";
// import { resetState } from "../../../../redux/auctions/auctionSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bid } from "../../../../types/bidding/bidding";
import { parseISO } from "date-fns";
import EditModalPopUp from "./modalEditAmout";
import DeleteBidModal from "./deleteBid";
import BidGroup from "./bidGroup";
import { useNavigate, Link} from "react-router-dom";


const ViewBidPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id);

  // const aucttionData = useSelector((state: RootState) => state.auction.auction);


  
  const bids = useSelector((state: RootState) => state.bidding.bids) || [];
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [canEdit, setCanEdit] = useState<{ [key: string]: boolean }>({});
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bidToDelete, setBidToDelete] = useState<Bid | null>(null);
  const [stats, setStats] = useState<{ [key: string]: { averageBid: number, totalBids: number, totalPayment: number } }>({});
  // const [completedAuctionAmount, setCompletedAuctionAmount] = useState<number | null>(null); // Add state for completed auction amount
  const [completedAuctions, setCompletedAuctions] = useState<Set<string>>(new Set()); // Track completed auctions
  const navigate = useNavigate();

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
        const endTime = bid.bidEndTime.endTimeBid ? parseISO(bid.bidEndTime.endTimeBid) : null;
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
  const groupBidsByProduct = () => {
    const groupedBids: { [key: string]: Bid[] } = {};

    bids.forEach((bid: Bid) => {
   
      const productId = bid.product_bidding?.productId?._id;
    
      
      if (productId) {
        if (!groupedBids[productId]) {
          groupedBids[productId] = [];
        }
        groupedBids[productId].push(bid);
      }
    });

    return Object.values(groupedBids);
  };
  // const calculateTimeLeft = (endTime: string) => {
  //   const currentTime = new Date().getTime();
  //   const endTimeMs = new Date(endTime).getTime();
  //   return endTimeMs - currentTime;
  // };
  const bidGroups = groupBidsByProduct();

  const handleCompleteAuction = async (productId: string, timeTrackID: string) => {
    if (!productId) {
      toast.error("Đấu giá bị lỗi");
      return; // Stop further execution if no productId is available
    }

    if (completedAuctions.has(productId)) {
      return; // Skip if auction is already completed
    }
    if(!userId){
      toast.error("Bạn chưa có tài khoản");
      return
    }
    try {
      // Call your dispatch action to complete the auction and update the winner
      await dispatch(completeAuction({ productId, timeTrackID }));
   
      toast.success("Hoàn thành đấu giá", {
        onClose: () => {
          setCompletedAuctions((prev) => new Set(prev).add(productId));
          navigate('/checkoutAuc');
        },
      });
  

    } catch (error) {
      toast.error("Failed to complete auction");
      console.error("Complete auction error:", error);
    }
  };
  // useEffect(() => {
  //   // Tạo một mảng mới chỉ chứa các auctions chưa hoàn thành
  //   const incompleteAuctions = bidGroups.flat().filter(bid => {
  //     const timeLeft = calculateTimeLeft(bid.bidEndTime.endTimeBid);
  //     const productId = bid.product_bidding.productId._id;
  //     // Kiểm tra thời gian còn lại và xem auction đã hoàn thành chưa
  //     return timeLeft <= 0 && !completedAuctions.has(productId);
  //   });
  
  //   if (incompleteAuctions.length > 0) {
  //     incompleteAuctions.forEach((bid) => {
  //       const productId = bid.product_bidding.productId._id;
  //       handleCompleteAuction(productId, bid._id);
  //     });
  //   }
  // }, [bidGroups, completedAuctions]); // Only re-run the effect when `bidGroups` or `completedAuctions` change

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white mb-16">
        
            <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Lượt đấu giá</h2>
          <Link to={'/profile'}
           
            className="bg-indigo-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-200"
          >
         Lịch sử lệnh đấu giá
          </Link>
        </div>
            <hr className="border-gray-300 mt-4 mb-8" />

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
