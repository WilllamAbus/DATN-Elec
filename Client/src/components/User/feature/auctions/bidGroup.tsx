import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { format, parseISO, isValid, differenceInMilliseconds } from "date-fns";
import { vi } from "date-fns/locale";
import { Bid } from "../../../../types/bidding/bidding";
import { Link } from "react-router-dom";

interface BidGroupProps {
  bidsGroup: Bid[];
  canEdit: { [key: string]: boolean };
  openEditModal: (bid: Bid) => void;
  openDeleteModal: (bid: Bid) => void;
  handleCompleteAuction: (productId: string, timeTrackID: string) => void;
}

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

const BidGroup: React.FC<BidGroupProps> = ({
  bidsGroup,
  canEdit,
  openEditModal,
  openDeleteModal,
  handleCompleteAuction,
}) => {


  const endTime = bidsGroup[0]?.bidEndTime?.endTimeBid
    ? parseISO(bidsGroup[0].bidEndTime.endTimeBid)
    : null;
  const isValidEndTime = endTime ? isValid(endTime) : false;
  const currentTime = new Date();
  const remainingTimeMs =
    isValidEndTime && endTime ? differenceInMilliseconds(endTime, new Date()) : 0;

  // Format thời gian còn lại
  const formatRemainingTime = (ms: number) => {
    if (ms <= 0) return "Hết thời gian";
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);

    return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
  };

  const remainingTimeFormatted = formatRemainingTime(remainingTimeMs);
  const productId = bidsGroup[0].product_bidding?.productId?._id;
  const [, setIsNotified] = useState(false);
  // Hoàn thành đấu giá khi hết thời gian
  useEffect(() => {
    if (
      remainingTimeMs <= 0 &&
      productId &&
      bidsGroup.length > 0 &&
      bidsGroup[0]?.bidEndTime?._id 
    
    ) {
      setIsNotified(true);
      handleCompleteAuction(productId, bidsGroup[0].bidEndTime._id);
    }
  }, [remainingTimeMs, productId, bidsGroup, handleCompleteAuction]);

  // Tách render thông tin sản phẩm
  const renderProductInfo = () => (
    <div className="col-span-2 flex items-center gap-4">
      <div className="w-15 h-24 m-4 shrink-0 border bg-white p-2 rounded-md">
        <Link to={`/detailAuc/${productId}`}>
          <img
            src={bidsGroup[0].product_bidding.productId.image[0]}
            className="w-full h-full object-contain"
            alt={bidsGroup[0].product_bidding.productId.product_name}
          />
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-gray-800 font-bold text-xl">
          {bidsGroup[0].product_bidding.productId.product_name}
        </p>
        <p className="text-gray-600">
          Thời gian hiện tại:{" "}
          {format(currentTime, "HH:mm:ss, 'ngày' EEEE, d MMMM 'năm' yyyy", { locale: vi })}
        </p>
        <p className="text-gray-600">
          Thời gian kết thúc:{" "}
          {isValidEndTime && endTime
            ? format(endTime, "HH:mm:ss, 'ngày' EEEE, d MMMM 'năm' yyyy", { locale: vi })
            : "Không xác định"}
        </p>
        <p className="text-gray-800">Thời gian còn lại: {remainingTimeFormatted}</p>
      </div>
    </div>
  );

  // Tách render danh sách đấu giá
  const renderBidsList = () =>
    bidsGroup.map((bid) => {
      const bidEndTime = bid.bidEndTime?.endTimeBid
        ? parseISO(bid.bidEndTime.endTimeBid)
        : null;
      const isValidBidEndTime = bidEndTime ? isValid(bidEndTime) : false;
      const timeLeftForBidMs =
        isValidBidEndTime && bidEndTime
          ? differenceInMilliseconds(bidEndTime, currentTime)
          : 0;

      return (
        <div
          key={bid._id}
          className="bg-white p-3 m-1 rounded-md border border-[color:#DAA520] shadow-lg"
        >
          <p className="font-bold text-gray-700">Thông tin đấu giá</p>
          <p className="text-gray-600">
            Ngày đấu giá:{" "}
            {format(parseISO(bid.createdAt), "d/M/yy HH:mm:ss", { locale: vi })}
          </p>
          <p className="text-gray-600">
            Giá đấu: {bid.bidAmount.toLocaleString()} đ
          </p>
          <div className="flex gap-2 mt-2">
            {canEdit[bid._id] && (
              <Button
                color="light"
                onClick={() => openEditModal(bid)}
                disabled={timeLeftForBidMs < FIFTEEN_MINUTES_MS}
              >
                Sửa
              </Button>
            )}
            <Button color="red" onClick={() => openDeleteModal(bid)}>
              Xóa
            </Button>
          </div>
        </div>
      );
    });

  return (
    <div
      key={bidsGroup[0]._id}
      className="grid bg-white grid-cols-3 items-center gap-4 border-2 border-[color:#E5E4E2] shadow-md"
    >
      {renderProductInfo()}
      <div className="flex flex-col gap-2">{renderBidsList()}</div>
    </div>
  );
};

export default BidGroup;
