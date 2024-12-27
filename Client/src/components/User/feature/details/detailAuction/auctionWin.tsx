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
import { Link } from "react-router-dom";



export default function AuctionWin( ) {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });

  return (
    <Modal
      backdrop="blur"
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
        <>
          <ModalHeader className="flex flex-col gap-1">Thông báo</ModalHeader>
          <ModalBody className="flex flex-col items-center">
            <Image
              alt="Ảnh thắng"
              src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/auctionResult%2FBOD.gif?alt=media&token=95ad3955-c06d-4e74-89d8-884978773c81"
              className="w-full" 
              width={800}
              height={250}

            />
         
          </ModalBody>
          <ModalFooter>
          <Link to="/auction"> <MyButton variant="gradientBlue" size="sm"  >Trở về danh sách đấu giá </MyButton> </Link>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
