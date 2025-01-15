import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AuctionStatusOutOfTime4() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Card className="max-w-full shadow-sm bg-gradient-to-r from-[#4CAF50] to-[#A5D6A7] pt-16 pb-16">
        <CardBody className="text-left">
          <div className="text-2xl text-center font-bold text-white dark:text-white">
            Đấu giá kết thúc nhưng không có người thắng!
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
