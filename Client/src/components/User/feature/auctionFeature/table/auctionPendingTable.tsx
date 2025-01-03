import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { AuctionWin } from "../../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser";
import { confirmAuctionThunk, getAuctionWinsByUserThunk, canceledAuctionThunk, clearAuctionWinById, getUserPendingAuctionWinsThunk } from "../../../../../redux/sessionAuction/thunk";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import ModalComponent from "../auctionDetail/auctionDetail";
import { toast, Toaster } from "react-hot-toast";
import AlerWaringAuction from "src/common/alert/alerWaringAuction";

interface AuctionPendingTableProps {
  currentPage: number;
}

const AuctionPendingTable: React.FC<AuctionPendingTableProps> = ({ currentPage }) => {
  const dispatch = useDispatch<AppDispatch>();
  const auctions = useSelector((state: RootState) => state.auctionWin.getAuctionWinsByUser.auctionWins ?? []);
  const [selectedAuction, setSelectedAuction] = useState<AuctionWin | null>(null);
  const [remainingTimes, setRemainingTimes] = useState<{ [key: string]: string }>({});
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notificationFlag = useRef(false);

  const handleRowClick = (auction: AuctionWin) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const newRemainingTimes = auctions.reduce<{ [key: string]: string }>((acc, auction) => {
        const endTime = new Date(auction.endTime).getTime();
        const currentTime = new Date().getTime();
        const remainingTime = endTime - currentTime;

        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        acc[auction._id] = remainingTime > 0
          ? `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`
          : "Đã kết thúc";

        return acc;
      }, {});

      setRemainingTimes(newRemainingTimes);

      const expiredAuctions = auctions.filter((auction) => newRemainingTimes[auction._id] === "Đã kết thúc");
      if (expiredAuctions.length > 0 && !notificationFlag.current) {
        notificationFlag.current = true;

        try {
          const response = await dispatch(getUserPendingAuctionWinsThunk()).unwrap();
          
          if (response.code === 'THANH_CONG') {
            toast.success(response.msg || "Cập nhật trạng thái thành công!");

            setTimeout(() => {
              setAlertVisible(true);
              setTimeout(() => {
                expiredAuctions.forEach((auction) => dispatch(clearAuctionWinById(auction._id)));
                notificationFlag.current = false;
                setAlertVisible(false);
              }, 5000);
            }, 3000);
          } else {
            toast.success(response.msg || "Không có thay đổi trạng thái!");
            notificationFlag.current = false;
          }
        } catch (error: any) {
          toast.error(error.msg || "Cập nhật trạng thái thất bại!");
          notificationFlag.current = false;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auctions, dispatch]);
  
  const handleConfirm = async () => {
    if (selectedAuction) {
      try {
        const response = await dispatch(confirmAuctionThunk({ auctionWinnerId: selectedAuction._id })).unwrap();
        toast.success(response.msg || "Xác nhận thành công!");
        setSelectedAuction(null);
        setIsModalOpen(false);
        setTimeout(async () => {
          await dispatch(getAuctionWinsByUserThunk({ page: currentPage }));
          dispatch(clearAuctionWinById(selectedAuction._id));
        }, 1000);

      } catch (error: any) {
        toast.error(error.msg || "Xác nhận đấu giá thất bại!");
        console.error("Xác nhận đấu giá thất bại:", error);
      }
    }
  };

  const handleCancel = async () => {
    if (selectedAuction) {
      try {
        const response = await dispatch(canceledAuctionThunk({ auctionWinnerId: selectedAuction._id })).unwrap();
        toast.success(response.msg || "Hủy đấu giá thành công!");
        setSelectedAuction(null);
        setIsModalOpen(false);
        setTimeout(async () => {
          await dispatch(getAuctionWinsByUserThunk({ page: currentPage }));
          dispatch(clearAuctionWinById(selectedAuction._id));
        }, 1000);

      } catch (error: any) {
        toast.error(error.msg || "Hủy đấu giá thất bại!");
        console.error("Hủy đấu giá thất bại:", error);
      }
    }
  };

  const renderCell = (auction: AuctionWin, columnKey: string) => {
    switch (columnKey) {
      case "auctionPricingRange.product_randBib.product_name":
        const productName = auction.auctionPricingRange && auction.auctionPricingRange.product_randBib
          ? auction.auctionPricingRange.product_randBib.product_name
          : "Tên sản phẩm";

        const displayProductName = productName.length > 20
          ? `${productName.substring(0, 20)}...`
          : productName;

        return (
          <Tooltip content={productName} delay={10}>
            <span>{displayProductName}</span>
          </Tooltip>
        );

      case "bidPrice":
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(auction.bidPrice);

      case "startTime":
        return new Date(auction.startTime).toLocaleString();

      case "endTime":
        return new Date(auction.endTime).toLocaleString();

      case "remainingTime": {
        const remainingTimeInMs = new Date(auction.endTime).getTime() - new Date().getTime();
        let colorClass = "text-green-500";

        if (remainingTimeInMs <= 60 * 1000) {
          colorClass = "text-red-500";
        } else if (remainingTimeInMs <= 60 * 60 * 1000) {
          colorClass = "text-orange-500";
        }

        return <span className={colorClass}>{remainingTimes[auction._id]}</span>;
      }

      case "confirmationStatus":
        let confirmationStatus = "";
        if (auction.confirmationStatus === "pending" && auction.auctionStatus === "won") {
          confirmationStatus = "Chờ xác nhận";
        } else if (auction.confirmationStatus === "pending" && auction.auctionStatus === "pending") {
          confirmationStatus = "Chờ xử lý";
        } else if (auction.confirmationStatus === "pending" && auction.auctionStatus === "temporary") {
          confirmationStatus = "Cần thanh toán"; 
        } else if (auction.confirmationStatus === "temporary" && auction.auctionStatus === "temporary") {
          confirmationStatus = "Cần thanh toán";
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
        const auctionStatus = auction.auctionStatus === "won" ? "Chiến thắng đấu giá" : "Danh sách hàng chờ";
        return auctionStatus;

      default:
        return null;
    }
  };

  return (
    <>
    <AlerWaringAuction visible={alertVisible} />
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
          {auctions.map((auction) => (
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
