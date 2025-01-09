"use client";

import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AuctionStatusOutOfTime() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
   
    >
      <Card className="max-w-full shadow-sm bg-red-50 pt-16 pb-16">
        <CardBody className="text-left">
          <h2  className="block mb-2 text-sm text-center font-medium text-gray-900 dark:text-white">Đấu giá đã kết thúc</h2>
          <div className="text-2xl text-center font-bold text-red-600 dark:text-white">Người thắng cuộc đã được ghi nhận.</div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
