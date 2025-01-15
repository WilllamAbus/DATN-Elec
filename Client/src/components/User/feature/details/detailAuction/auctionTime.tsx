import React, { useState, useEffect } from "react";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import type { RootState } from "src/redux/rootReducer";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "src/redux/store";
import { checkAuctionTimeAuctionPricingRangeThunk } from "../../../../../redux/product/client/Thunk";
import socket from '../../../../../services/rtsk/sk';
import { motion } from "framer-motion";

interface AuctionTimeProps {
  onChangeCheckAuctionTimeAuctionPricingRange: () => void;
}

const AuctionTime: React.FC<AuctionTimeProps> = ({ onChangeCheckAuctionTimeAuctionPricingRange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const auctionPricing = useSelector(
    (state: RootState) => state.productClient.getProductDetailAuction.productDetailAuction?.auctionPricing
  );
  const productDetailAuction = useSelector(
    (state: RootState) => state.productClient.getProductDetailAuction.productDetailAuction
  );
  const slug = useSelector(
    (state: RootState) => state.productClient.getProductDetailAuction.productDetailAuction?.slug
  );

  const [timeLeft, setTimeLeft] = useState<string>(auctionPricing?.remainingTime || "Đang tải...");
  const [timeWarning, setTimeWarning] = useState<boolean>(false);

  useEffect(() => {
    if (!auctionPricing || !slug) return;

    const endTime = new Date(auctionPricing.endTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("Hết thời gian!");


        if (["active", "ended", "paid", "temporary"].includes(auctionPricing.status) && ["active", "ended", "paid", "temporary"].includes(productDetailAuction?.status || "")) {
          dispatch(checkAuctionTimeAuctionPricingRangeThunk(slug))
            .unwrap()
            .then(() => {
              onChangeCheckAuctionTimeAuctionPricingRange();
            })
            .catch((error: { code: string; message: string }) => {
              console.error("Failed to check auction time:", error);
            });
        }
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(
          `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`
        );
        if (difference <= 5 * 60 * 1000) {
          setTimeWarning(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionPricing, slug, dispatch, onChangeCheckAuctionTimeAuctionPricingRange]);

  useEffect(() => {
    socket.on('auctionStatusOutOfTime', (data: { status: string }) => {
      if (data.status === 'outOfTime') {
        setTimeLeft("Hết thời gian!");

      }
    });

    socket.on('auctionStatusInProgress', (data: { status: string }) => {
      if (data.status === 'inProgress') {
        setTimeLeft(auctionPricing?.remainingTime || "Đang diễn ra");

      }
    });

    socket.on('auctionStatusHasWinner', (data: { status: string }) => {
      if (data.status === 'endedWithWinner') {
        setTimeLeft("Đã có người thắng!");

      }
    });

    socket.on('auctionStatusNoWinner', (data: { status: string }) => {
      if (data.status === 'endedNoWinner') {
        setTimeLeft("Đấu giá kết thúc nhưng không có người thắng!");

      }
    });

    socket.on('auctionStatusPaid', (data: { status: string }) => {
      if (data.status === 'paid') {
        setTimeLeft("Đấu giá đã thanh toán!");

      }
    });

    socket.on('auctionStatusTemporary', (data: { status: string }) => {
      if (data.status === 'temporary') {
        setTimeLeft("Phiên đấu giá tạm thời cần cập nhật!");

      }
    });

    return () => {
      socket.off('auctionStatusOutOfTime');
      socket.off('auctionStatusInProgress');
      socket.off('auctionStatusHasWinner');
      socket.off('auctionStatusNoWinner');
      socket.off('auctionStatusPaid');
      socket.off('auctionStatusTemporary');
    };
  }, [auctionPricing?.remainingTime]);

  if (!auctionPricing) {
    return (
      <div className="flex justify-center items-center min-h-[100px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <motion.div
    animate={{ opacity: 1 }}
    initial={{ opacity: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="max-w-full shadow-lg rounded-lg bg-gradient-to-r from-[#6FA3E5] to-[#A9D5F4] pt-16 pb-16">
      <CardBody className="text-left">
        <label className="block mb-2 text-sm text-center font-medium text-gray-700">
          Thời gian còn lại:
        </label>
        <div
          className={`text-2xl text-center font-bold ${timeWarning ? 'text-red-600' : 'text-green-600'} dark:text-white`}
        >
          {timeLeft}
        </div>
      </CardBody>
    </Card>
  </motion.div>
  );
};

export default AuctionTime;
