import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import { AuctionWin } from "../../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser";
import { confirmAuctionThunk,getAuctionWinsByUserThunk,canceledAuctionThunk } from "../../../../../redux/sessionAuction/thunk";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import ModalComponent from "../auctionDetail/auctionDetail"; 
import { toast, Toaster } from "react-hot-toast"
interface AuctionPendingTableProps {
  auction: AuctionWin[];
  currentPage: number
}

const AuctionPendingTable: React.FC<AuctionPendingTableProps> = ({ auction,currentPage}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [remainingTimes, setRemainingTimes] = useState<{ [key: string]: string }>({});
  const [selectedAuction, setSelectedAuction] = useState<AuctionWin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTimes = auction.reduce<{ [key: string]: string }>((acc, auction) => {
        const endTime = new Date(auction.endTime).getTime();
        const currentTime = new Date().getTime();
        const remainingTime = endTime - currentTime;
        
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        acc[auction._id] = remainingTime > 0 
          ? `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây` 
          : "Đã kết thúc";
        
        return acc;
      }, {});
      
      setRemainingTimes(newRemainingTimes);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [auction]);

  const handleRowClick = (auction: AuctionWin) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedAuction) {
      try {
        const response = await dispatch(confirmAuctionThunk({ auctionWinnerId: selectedAuction._id })).unwrap();
        toast.success(response.msg || "Xác nhận thành công!");
        dispatch(getAuctionWinsByUserThunk({ page: currentPage }));
        setIsModalOpen(false);
      } catch (error: any) {
        toast.error(error.msg || "Xác nhận đấu giá thất bại!");
      }
    }
  };
  

  const handleCancel = async () => {
    if (selectedAuction) {
      try {
        const response = await dispatch(canceledAuctionThunk({ auctionWinnerId: selectedAuction._id })).unwrap(); 
        toast.success(response.msg || "Hủy đấu giá thành công!");
        await dispatch(getAuctionWinsByUserThunk({ page: currentPage }));
        setIsModalOpen(false);
      } catch (error: any) {
        toast.error(error.msg || "Hủy đấu giá thất bại!");
        console.error("Hủy đấu giá thất bại:", error);
      }
    }
  };


  const renderCell = (auction: AuctionWin, columnKey: string) => {
    switch (columnKey) {
      case "auctionPricingRange.product_randBib.product_name":
        return auction.auctionPricingRange.product_randBib.product_name;

      case "bidPrice":
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(auction.bidPrice);

      case "startTime":
        return new Date(auction.startTime).toLocaleString();

      case "endTime":
        return new Date(auction.endTime).toLocaleString();

      case "remainingTime":
        const timeDisplay = remainingTimes[auction._id];
        const remainingTimeInMs = new Date(auction.endTime).getTime() - new Date().getTime();
        const timeStyle = remainingTimeInMs > 0 && Math.floor((remainingTimeInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 1 
          ? { color: 'red', fontWeight: 'bold' } 
          : {};
  
        return <span style={timeStyle}>{timeDisplay}</span>;

      case "confirmationStatus":
        let confirmationStatus = "";
        if (auction.confirmationStatus === "pending" && auction.auctionStatus === "won") {
          confirmationStatus = "Chờ xác nhận";
        } else if (auction.confirmationStatus === "pending" && auction.auctionStatus === "pending") {
          confirmationStatus = "Chờ xử lý";
        } else {
          confirmationStatus = auction.confirmationStatus;
        }
        return (
          <Tooltip content={confirmationStatus} delay={0}>
            <span>
              {confirmationStatus.length > 20 ? `${confirmationStatus.substring(0, 20)}...` : confirmationStatus}
            </span>
          </Tooltip>
        );

      case "auctionStatus":
        const auctionStatus = auction.auctionStatus === "won" ? "Chiến thắng đấu giá" : "Đang trong danh sách hàng chờ";
        return auctionStatus;

      default:
        return null;
    }
  };

  return (
    <>
      <Table isStriped aria-label="Danh sách đấu giá">
        <TableHeader>
          <TableColumn>Tên sản phẩm</TableColumn>
          <TableColumn>Giá trúng</TableColumn>
          <TableColumn>Thời gian bắt đầu</TableColumn>
          <TableColumn>Thời gian kết thúc</TableColumn>
          <TableColumn>Thời gian còn lại</TableColumn>
          <TableColumn>Trạng thái xác nhận</TableColumn>
          <TableColumn>Trạng thái đấu giá</TableColumn>
        </TableHeader>
        <TableBody>
          {auction.map((auction) => (
            <TableRow key={auction._id} onClick={() => handleRowClick(auction)} className="cursor-pointer">
              {["auctionPricingRange.product_randBib.product_name", "bidPrice", "startTime", "endTime", "remainingTime", "confirmationStatus", "auctionStatus"].map(
                (columnKey) => (
                  <TableCell key={columnKey}>{renderCell(auction, columnKey)}</TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAuction && (
        <ModalComponent
          auction={selectedAuction}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm} 
          onCancel={handleCancel} 
        />
      )}
      <Toaster />

    </>
  );
};

export default AuctionPendingTable;
