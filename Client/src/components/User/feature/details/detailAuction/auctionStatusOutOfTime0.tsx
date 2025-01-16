import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

export default function AuctionStatusOutOfTime0() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="max-w-full shadow-lg rounded-lg bg-gradient-to-r from-[#338ef7] via-[#6faee5] to-[#a4c8e3] pt-16 pb-16">
        <CardBody className="text-left px-8 py-6">
        <div className="text-3xl text-center font-extrabold text-white mb-4">
            Đấu giá đã kết thúc
          </div>
          <div className="text-lg text-center font-medium text-white opacity-80">
         Chúc mừng bạn đã trúng đấu giá
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
