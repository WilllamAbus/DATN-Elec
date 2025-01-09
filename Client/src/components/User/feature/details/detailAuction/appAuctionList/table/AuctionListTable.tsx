
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { Bid } from "../../../../../../../services/detailProductAuction/types/getAuctionProgress";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../redux/store";
import AuctionListSkeleton from './auctionListSkeleton';
interface AuctionTableProps {
  biddingList: Bid[];
  isLoading: boolean; 
  total: number; 
}

const getRowColor = (index: number): string => {
  switch (index) {
    case 0:
      return "bg-transparent text-[#3b9f82] font-bold";
    case 1:
      return "text-yellow-500 font-bold";
    case 2:
      return "text-orange-500 font-bold";
    default:
      return "font-bold text-black";
  }
};

const renderCell = (item: Bid, columnKey: string, userId: string, index: number) => {
  if (!item.user) { return <TableCell key={columnKey} className="text-red-500">N/A</TableCell>; }
  const cellClass = getRowColor(index);
  const content = columnKey === "name" ? item.user.name : columnKey === "bidPrice" ? `${item.bidPrice.toLocaleString()} đ` : new Date(item.bidTime).toLocaleString("vi-VN");

  if (userId === item.user._id) {
    return (
      <TableCell key={columnKey} className={cellClass}>
        <Tooltip content="Bạn đang trong danh sách đấu giá">
          <span>{content}</span>
        </Tooltip>
      </TableCell>
    );
  }

  return <TableCell key={columnKey} className={cellClass}>{content}</TableCell>;
};

export default function AuctionTable({ biddingList, isLoading, total }: AuctionTableProps) {
  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id) || "";

  if (isLoading) {
    return <AuctionListSkeleton total={total} />;
  }

  return (
    <Table isStriped aria-label="Bidding List Table">
      <TableHeader>
        <TableColumn key="name">Tên</TableColumn>
        <TableColumn key="bidPrice">Giá đặt</TableColumn>
        <TableColumn key="bidTime">Thời gian đặt giá</TableColumn>
      </TableHeader>
      <TableBody>
        {biddingList.map((item, index) => (
          <TableRow key={item._id}>
            {["name", "bidPrice", "bidTime"].map((columnKey) =>
              renderCell(item, columnKey, userId, index)
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
