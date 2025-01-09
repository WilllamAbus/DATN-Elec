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
import { MyButton } from "../../../../../common/customs/MyButton";

export default function AuctionEnded() {
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
        <ModalHeader className="flex flex-col gap-1">Thông báo</ModalHeader>
        <ModalBody className="flex flex-col items-center">
          <Image
            alt="Ảnh thua"
            src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/auctionResult%2Fhet-thoi-gian.svg?alt=media&token=50444cc1-08b7-4e9d-8542-ec31741b6e72"
            width={300}
          />
          <p>Đấu giá kết thúc sao 5 giây hệ thống sẽ thoát khỏi trang</p>
        </ModalBody>
        <ModalFooter>
          <Link to="/auction">
            {" "}
            <MyButton variant="gradientBlue" size="sm">
              Trở về danh sách đấu giá{" "}
            </MyButton>{" "}
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
