import React from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";

interface WarningAuctionProps {
  warningCount: number;
  penaltyDuration: string;
}

const WarningAuction: React.FC<WarningAuctionProps> = ({ warningCount, penaltyDuration }) => {
  const message = warningCount > 3 
    ? "Tài khoản của bạn đã bị cấm vào đấu giá vĩnh viễn." 
    : `Hệ thống ghi nhận bạn hủy lần ${warningCount} nên hệ thống sẽ phạt bạn ${penaltyDuration}.`;

  return (
    <Popover placement="bottom" showArrow backdrop="opaque" className="w-[240px]">
      <PopoverTrigger>
        <Button size="sm" color="warning" variant="ghost">Cảnh báo</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        <div className="px-1 py-2">
          <div className="text-small font-bold">Cảnh báo</div>
          <div className="text-tiny">{message}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WarningAuction;
