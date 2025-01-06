
import { Tooltip } from "@nextui-org/react";
import { AuctionWin } from "../../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser";

export const renderCell = (auction: AuctionWin, columnKey: string, remainingTimes: { [key: string]: string }) => {
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
        const remainingTimeStr = remainingTimes[auction._id];
        if (!remainingTimeStr) {
          return <span>Đã kết thúc</span>;
        }
        
        let colorClass = "text-green-500";
  
        const [days, hours, minutes, seconds] = remainingTimeStr.match(/\d+/g)?.map(Number) ?? [0, 0, 0, 0];
        const totalRemainingTimeInMs = (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
  
        if (totalRemainingTimeInMs <= 60 * 1000) {
          colorClass = "text-red-500";
        } else if (totalRemainingTimeInMs <= 60 * 60 * 1000) {
          colorClass = "text-orange-500";
        }
  
        return <span className={colorClass}>{remainingTimeStr}</span>;
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
