import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
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
  const slug = useSelector(
    (state: RootState) => state.productClient.getProductDetailAuction.productDetailAuction?.slug
  );

  const [timeLeft, setTimeLeft] = useState<string>(auctionPricing?.remainingTime || "Đang tải...");
  const [isEnded, setIsEnded] = useState<boolean>(false);

  useEffect(() => {
    if (!auctionPricing || !slug) return;

    const endTime = new Date(auctionPricing.endTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("Hết thời gian!");
        setIsEnded(true);
        dispatch(checkAuctionTimeAuctionPricingRangeThunk(slug))
          .unwrap()
          .then(() => {
            onChangeCheckAuctionTimeAuctionPricingRange();
          })
          .catch((error: { code: string; message: string }) => {
            console.error("Failed to check auction time:", error);
          });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(
          `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionPricing, slug, dispatch, onChangeCheckAuctionTimeAuctionPricingRange]);

  useEffect(() => {
    socket.on('auctionStatusOutOfTime', (data: { status: string }) => {
      if (data.status === 'outOfTime') {
        setTimeLeft("Hết thời gian!");
        setIsEnded(true);
      }
    });

    return () => {
      socket.off('auctionStatusOutOfTime');
    };
  }, []);

  if (!auctionPricing) {
    return <div>Đang tải...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isEnded ? 0 : 1 }}
      transition={{ duration: 2 }}
    >
      <Card className="max-w-full shadow-sm bg-red-50 pt-16 pb-16">
        <CardBody className="text-left">
          <label className="block mb-2 text-sm text-center font-medium text-gray-900 dark:text-white">
            Thời gian còn lại:
          </label>
          <div className="text-2xl text-center font-bold text-red-600 dark:text-white">
            {timeLeft}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default AuctionTime;
