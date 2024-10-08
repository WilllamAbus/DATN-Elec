import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store";
import { fetchBidsByUserThunk } from "../../../../redux/bidding/biddingThunk";
import { completeAuction } from "../../../../redux/auctions/auctionThunk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bid } from "../../../../types/bidding/bidding";
import { parseISO } from "date-fns";
import EditModalPopUp from "./modalEditAmout";
import DeleteBidModal from "./deleteBid";
import BidGroup from "./bidGroup";
import { useNavigate } from "react-router-dom";

const ViewBidPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id);

  
  const bids = useSelector((state: RootState) => state.bidding.bids) || [];
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [canEdit, setCanEdit] = useState<{ [key: string]: boolean }>({});
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bidToDelete, setBidToDelete] = useState<Bid | null>(null);
  const [stats, setStats] = useState<{ [key: string]: { averageBid: number, totalBids: number, totalPayment: number } }>({});
  const [completedAuctionAmount, setCompletedAuctionAmount] = useState<number | null>(null); // Add state for completed auction amount

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
      console.log('Checking bid:', bid);
      const productId = bid.product_bidding?.productId?._id;
      console.log('productId', productId);
      
      if (productId) {
        if (!groupedBids[productId]) {
          groupedBids[productId] = [];
        }
        groupedBids[productId].push(bid);
      }
    });

    return Object.values(groupedBids);
  };

  const bidGroups = groupBidsByProduct();

  const handleCompleteAuction = (productId: string, timeTrackID: string) => {
    dispatch(completeAuction({ productId, timeTrackID }))
      .then(() => {
        // Calculate and display the total amount for the completed auction
        const averageAmount = bids.find(bid => bid._id === timeTrackID)?.amount || 0;
        const totalAmount = averageAmount * 1; // Adjust this calculation as needed
        setCompletedAuctionAmount(totalAmount); // Use the state variable to store the amount

        // Show success toast
        toast.success("Hoàn thành đấu giá");

        // Navigate to a different route, e.g., the auction list page
        navigate("/checkoutAuc");
      })
      .catch((error: any) => {
        // Show error toast if something goes wrong
        toast.error("Failed to complete auction.");
        console.error("Complete auction error:", error);
      });
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white mb-16">
            <h2 className="text-2xl font-bold text-gray-800">Lượt đấu giá</h2>
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
          {Object.entries(stats).map(([productId, { averageBid, totalBids, totalPayment }]) => (
            <div key={productId} className="mb-4">
              <h3 className="text-md font-medium text-gray-700">Sản phẩm: {productId}</h3>
              <p className="text-gray-600">Trung bình giá đấu: {averageBid.toLocaleString()} đ</p>
              <p className="text-gray-600">Tổng số lượt đấu giá: {totalBids}</p>
              <p className="text-gray-600">Tổng thanh toán: {totalPayment.toLocaleString()} đ</p>
            </div>
          ))}
          {completedAuctionAmount !== null && (
            <div className="mt-4 p-4 bg-green-100 rounded-md">
              <p className="text-lg font-semibold">Tổng số tiền hoàn thành đấu giá:</p>
              <p className="text-xl font-bold">{completedAuctionAmount.toLocaleString()} đ</p>
            </div>
          )}
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
