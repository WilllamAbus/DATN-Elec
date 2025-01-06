import { Avatar } from "@nextui-org/react";
import { MyButton } from "src/common/customs/MyButton";

export default function AuctionListTitle() {
  return (
    <>
      <div className="flex gap-2 items-center">
        <Avatar
          radius="full"
          size="sm"
          className="border-none"
          src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/icon%2FOrange%20White%20Modern%20Gradient%20%20IOS%20Icon%20(1).svg?alt=media&token=f7d5bd21-7241-4fcc-9c58-ad67f1a51566"
        />
        <div className="flex flex-col gap-1 items-center justify-center">
          <h4 className="text-small font-bold leading-none text-default-600">
            Diễn biến cuộc đấu giá
          </h4>
        </div>
      </div>
      <MyButton radius="full" size="xl" variant="transparent">
      </MyButton>
    </>

  );
}
