import React, { useEffect, useState } from "react";

interface AuctionTimerProps {
  auctionStartTime: string;
  auctionEndTime: string;
}

const AuctionTimer: React.FC<AuctionTimerProps> = ({
  auctionStartTime,
  auctionEndTime,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("Đang tải...");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const startTime = new Date(auctionStartTime).getTime();
    const endTime = new Date(auctionEndTime).getTime();

    const updateTimeLeft = () => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft("Hết thời gian!");
        setStatus("Đấu giá đã kết thúc.");
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}h:${minutes
          .toString()
          .padStart(2, "0")}m:${seconds.toString().padStart(2, "0")}s`
      );

      if (now < startTime) {
        setStatus("Đấu giá chưa bắt đầu.");
      } else if (now >= startTime && now <= endTime) {
        setStatus("Vui lòng thanh toán.");
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [auctionStartTime, auctionEndTime]);

  return (
    <div>
      <p>{timeLeft}</p>
      <p>{status}</p>
    </div>
  );
};

export default AuctionTimer;
