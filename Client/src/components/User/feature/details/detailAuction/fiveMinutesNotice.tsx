import React from "react";
import { Alert } from "@nextui-org/react";
import { motion } from "framer-motion";
import formatPrice from "../../../../../common/pricecurrency/formattedPrice";

interface FiveMinutesNoticeProps {
  highBidderInformation: {
    userName: string;
    bidPrice: number;
    startTime: string;
    endTime: string;
    remainingTime: string;
  } | null;
  visible: boolean;
}

const FiveMinutesNotice: React.FC<FiveMinutesNoticeProps> = ({ highBidderInformation, visible }) => {
  if (!highBidderInformation) {
    return null; 
  }

  const title = "Thông báo";
  const formattedBidPrice = formatPrice(highBidderInformation.bidPrice);
  const description = `Người dùng ${highBidderInformation.userName} đã đặt giá với giá tối đa ${formattedBidPrice}. Chúng tôi sẽ tạm ngưng đấu giá trong vòng 5 phút. Nếu người dùng không thanh toán, đấu giá sẽ diễn ra tiếp tục trong 5 phút sau.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
      transition={{ duration: 1 }}
    >
      <div className="flex items-center justify-center w-full">
        <Alert hideIcon color="success" description={description} title={title} variant="faded" />
      </div>
    </motion.div>
  );
};

export default FiveMinutesNotice;
