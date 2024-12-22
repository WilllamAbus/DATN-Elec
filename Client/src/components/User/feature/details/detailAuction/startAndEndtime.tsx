import { useState } from "react";
import { DatePicker } from "@nextui-org/react";
import { ProductAuction } from "../../../../../services/detailProductAuction/types/detailAuction";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date"; // Import CalendarDate and getLocalTimeZone for type compatibility

interface ProductStartAndEndTimeProps {
  product: ProductAuction;
}

export default function StartAndEndTime({ product }: ProductStartAndEndTimeProps) {
  // Convert Date to CalendarDate
  const startTime = new Date(product.auctionPricing.startTime);
  const endTime = new Date(product.auctionPricing.endTime);

  const [startDate, setStartDate] = useState<CalendarDate | null>( // Allow null in state
    new CalendarDate("gregory", startTime.getFullYear(), startTime.getMonth() + 1, startTime.getDate())
  );
  const [endDate, setEndDate] = useState<CalendarDate | null>( // Allow null in state
    new CalendarDate("gregory", endTime.getFullYear(), endTime.getMonth() + 1, endTime.getDate())
  );

  const formatter = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleStartDateChange = (newValue: CalendarDate | null) => {
    setStartDate(newValue); // No need for null check, since it's handled in the state
  };

  const handleEndDateChange = (newValue: CalendarDate | null) => {
    setEndDate(newValue); // No need for null check, since it's handled in the state
  };

  return (
    <div className="max-w-full shadow-sm">
      <div className="flex flex-row gap-2">
        <div className="w-full flex flex-col gap-y-2">
          <DatePicker
            color="primary"
               className="max-w-full"
            label="Bắt đầu"
            value={startDate}
            onChange={handleStartDateChange}
            isReadOnly
          />
          <p className="text-default-500 text-sm">
            Bắt đầu: {startDate ? formatter.format(startDate.toDate(getLocalTimeZone())) : "--"}
          </p>
        </div>

        <div className="w-full flex flex-col gap-y-2">
          <DatePicker
            color="danger"
            className="max-w-full"
            label="Kết thúc"
            value={endDate}
            onChange={handleEndDateChange}
            isReadOnly
          />
          <p className="text-default-500 text-sm">
            Kết thúc: {endDate ? formatter.format(endDate.toDate(getLocalTimeZone())) : "--"}
          </p>
        </div>
      </div>
    </div>

  );
}
