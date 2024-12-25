import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { MyButton } from "../../../../../common/customs/MyButton";

interface AuctionWinProps {
  onClose: () => void;
}

export default function AuctionWin({ onClose }: AuctionWinProps) {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });

  return (
    <Modal
      backdrop="blur"
      classNames={{
        body: "py-6",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-100",
        base: "border-[#292f46] bg-[#fff] dark:bg-[#19172c] text-[#a8b0d3]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
      isOpen={isOpen}
      radius="lg"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">Thông báo</ModalHeader>
          <ModalBody className="flex flex-col items-center">
            <Image
              alt="Ảnh thắng"
              src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/auctionResult%2FOrange%20White%20Modern%20Gradient%20%20IOS%20Icon%20(4).svg?alt=media&token=94b792df-0418-4078-af91-a0ea839ee6e2"
              className="w-full" 
              width={300}
              height={250}

            />
         
          </ModalBody>
          <ModalFooter>
            <MyButton variant="gradientBlue" size="sm" onPress={onClose}>
              Trở về danh sách đấu giá
            </MyButton>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
