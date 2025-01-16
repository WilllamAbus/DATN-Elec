import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AuctionStatusOutOfTime2() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Card className="max-w-full shadow-lg rounded-lg bg-gradient-to-r from-[#338ef7] via-[#73a9e2] to-[#a4c8e3] pt-16 pb-16">
        <CardBody className="text-left px-8 py-6">
          <div className="text-2xl text-center font-bold text-white mb-4">
            Đấu giá đã kết thúc
          </div>
          <div className="text-lg text-center font-medium text-white opacity-80">
            Không trúng đấu, chúc bạn may mắn lần sau.
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
