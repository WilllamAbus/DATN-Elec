import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { MyButton } from "../../../../../common/customs/MyButton";
import { motion } from "framer-motion";

export default function AuctionTemporaryMaxPrice() {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        if (!isOpen) {
          onOpenChange(); // Không truyền đối số vào hàm
        }
      }}
      radius="lg"
      size="3xl"
      closeButton={false} // Ẩn nút đóng
      backdrop="opaque" // Sử dụng giá trị hợp lệ cho backdrop
      classNames={{
        body: "py-6",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Thông báo</ModalHeader>
        <ModalBody className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="w-full max-w-sm overflow-hidden"
          >
            <img
              alt="Đã trúng đấu giá"
              src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/auctionResult%2Fgia-cao-4.svg?alt=media&token=6a288df1-4c71-4ec7-b3e1-512e5c403488"
              className="w-full"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg font-bold text-red-500 mt-4"
          >
            Bạn đã đặt giá cao nhất!
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-lg font-bold text-yellow-500 mt-2"
          >
            Vui lòng xác nhận thanh toán trong 5 phút để hoàn tất phiên đấu giá.
          </motion.p>
        </ModalBody>
        <ModalFooter>
          <Link to="/session-auction">
            <MyButton variant="gradientBlue" size="sm">
              Đi đến xác nhận phiên đấu giá
            </MyButton>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
