"use client";

import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AuctionStatusOutOfTime6() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
   
    >
      <Card className="max-w-full shadow-sm bg-red-50 pt-16 pb-16">
        <CardBody className="text-left">
          <div className="text-2xl text-center font-bold text-red-600 dark:text-white">Đấu giá vẫn đang diễn ra.</div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
