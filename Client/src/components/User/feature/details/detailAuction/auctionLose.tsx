import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
  Code
} from "@nextui-org/react";

export default function AuctionLose() {
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
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Thông báo</ModalHeader>
            <ModalBody>
              <Image
                alt="Ảnh thua"
                src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/winnerandlose%2FOrange%20White%20Modern%20Gradient%20%20IOS%20Icon%20(2).svg?alt=media&token=71a420cc-ce3e-4c96-966a-08aa6e5da4b8"
                width={300}
              />
              <Code color="primary" size="lg">Không trúng đấu giá</Code>
              <p>
                Đấu giá không thành công sản phẩm chúc bạn may mắn lần sao
              </p>
            </ModalBody>
            <ModalFooter>
              <Button className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20" onPress={onClose}>
                Trở về danh sách đấu giá
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
