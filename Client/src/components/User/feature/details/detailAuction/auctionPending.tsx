
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

export default function AuctionPending() {
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
          <ModalHeader className="flex flex-col gap-1">Thông báo</ModalHeader>
          <ModalBody className="flex flex-col items-center">
            <Image
              alt="Đang chờ"
              src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/auctionResult%2Fwait1.svg?alt=media&token=9edb9c92-6d23-4e2c-bd75-853667f5c4dd"
              width={300}
            />
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-lg font-medium"
            >
              Bạn đang trong danh sách hàng chờ. Nếu trong vòng 2 ngày, người trúng đấu giá không thanh toán, bạn sẽ được trúng đấu giá này.
            </motion.p>
          </ModalBody>
          <ModalFooter>
            <Link to="/session-auction">
              <MyButton variant="gradientBlue" size="sm">
                Đi đến phiên đấu giá
              </MyButton>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
};

