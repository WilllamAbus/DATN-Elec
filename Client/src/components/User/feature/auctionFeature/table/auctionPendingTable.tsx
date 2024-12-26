import React from "react";
import { AppDispatch } from "../../../../../redux/store";
import { AuctionWin } from "../../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";


interface AuctionPendingTableProps {
  auction: AuctionWin[];
  dispatch: AppDispatch;
  currentPage: number;
}

const AuctionPendingTable: React.FC<AuctionPendingTableProps> = ({ auction }) => {
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
        const endTime = new Date(auction.endTime).getTime();
        const currentTime = new Date().getTime();
        const remainingTime = endTime - currentTime;
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        const timeDisplay = remainingTime > 0 
          ? `${hours} giờ ${minutes} phút ${seconds} giây` 
          : "Đã kết thúc";
        
        const timeStyle = remainingTime > 0 && hours < 1 
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
        console.log(`Auction Status: ${auction.auctionStatus}`);
        const auctionStatus = auction.auctionStatus === "won" ? "Chiến thắng đấu giá" : "Đang trong danh sách hàng chờ";
        return auctionStatus;

      default:
        return null;
    }
  };

  return (
    <Table aria-label="Danh sách đấu giá">
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
          <TableRow key={auction._id}>
            {["auctionPricingRange.product_randBib.product_name", "bidPrice", "startTime", "endTime", "remainingTime", "confirmationStatus", "auctionStatus",].map(
              (columnKey) => (
                <TableCell key={columnKey}>{renderCell(auction, columnKey)}</TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuctionPendingTable;
