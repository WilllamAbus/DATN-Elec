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

export default function AuctionTemporary() {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });

  return (
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
        {(onClose) => (
          <>
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
                  alt="Ảnh thua"
                  src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/auctionResult%2Fgia-toi-da-2.svg?alt=media&token=e0adbce9-689e-46c5-9ceb-d9d18a83299a"
                  className="w-full"
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-lg font-bold text-red-500 mt-4"
              >
                Đã có người trúng đấu giá.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-lg font-bold text-yellow-500 mt-2"
              >
                Vui lòng đợi 5 phút để xác nhận.
              </motion.p>
            </ModalBody>
            <ModalFooter>
              <MyButton variant="waitSolid" size="sm" onPress={onClose}>
                Chờ
              </MyButton>
              <Link to="/auction">
                <MyButton variant="gradientBlue" size="sm">
                  Trở về danh sách đấu giá
                </MyButton>
              </Link>
            </ModalFooter>
          </>
        )}

      </ModalContent>
    </Modal>
  );
}
