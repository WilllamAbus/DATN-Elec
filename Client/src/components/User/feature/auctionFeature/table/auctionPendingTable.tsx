import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { AuctionWin } from "../../../../../services/AuctionWinsByUser/types/getAuctionWinsByUser";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import ModalComponent from "../auctionDetail/auctionDetail";
import { Toaster } from "react-hot-toast";
import AlerWaringAuction from "src/common/alert/alerWaringAuction";
import { handleConfirm } from "../handles/handleConfirm"; 
import { handleCancel } from "../handles/handleCancel";
import { handleCancelTemporary } from "../handles/handleCancelTemporary";
import { handleConfirmTemporary } from "../handles/handleConfirmTemporary";
import { renderCell } from "./renderCell"; 
import { useRemainingTimes } from "../handles/useRemainingTimes"; 

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
  useRemainingTimes(auctions, setRemainingTimes, dispatch, setAlertVisible, notificationFlag);
  
  const handleRowClick = (auction: AuctionWin) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
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
                  <TableCell key={columnKey}>{renderCell(auction, columnKey, remainingTimes)}</TableCell>
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
          onConfirm={() => handleConfirm(selectedAuction, dispatch, currentPage, setSelectedAuction, setIsModalOpen)}
          onConfirmTemporary={() =>
            handleConfirmTemporary(selectedAuction, dispatch, currentPage, setSelectedAuction, setIsModalOpen)
          } 
          onCancel={() => handleCancel(selectedAuction, dispatch, currentPage, setSelectedAuction, setIsModalOpen)}
          onCancelTemporary={() => handleCancelTemporary(selectedAuction, dispatch, currentPage, setSelectedAuction, setIsModalOpen)}
        />
      )}
      <Toaster />
    </>
  );
};

export default AuctionPendingTable;
