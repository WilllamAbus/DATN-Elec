import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MyButton } from "../../../../../common/customs/MyButton";

const AuctionWin0: React.FC = () => {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <Modal
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        isOpen={isOpen}
        radius="lg"
        onOpenChange={onOpenChange}
        size="3xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Chúc mừng!</ModalHeader>
          <ModalBody className="flex flex-col items-center">
            <Image
              alt="Winner"
              src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/auctionResult%2Fwinner0.svg?alt=media&token=d271a233-6cb2-4aae-b6c4-d73d08fadd7b"
              width={300}
            />
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-lg font-medium"
            >
              Bạn đã thắng phiên đấu giá! Hệ thống sẽ cập nhật chi tiết phiên đấu giá trong vài giây tới.
            </motion.p>
          </ModalBody>
          <ModalFooter>
            <Link to="/session-auction">
              <MyButton variant="gradientBlue" size="sm">
                Đến phiên đấu giá
              </MyButton>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
};

export default AuctionWin0;
