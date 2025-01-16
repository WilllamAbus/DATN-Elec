import { useEffect, useState } from "react";

interface AuctionData {
  auctionStartTime?: string;
  auctionEndTime?: string;
}

interface CartAuction {
  itemAuction: AuctionData[];
}

const useAuctionTimer = (cartauction: CartAuction[]) => {
  const [timeLeft, setTimeLeft] = useState<string>("Không có dữ liệu đấu giá.");
  const [status, setStatus] = useState<string>("Không có thông tin đấu giá.");

  // Hàm helper để tính thời gian còn lại
  const calculateTimeLeft = (startTime: number, endTime: number) => {
    const now = Date.now();
    const difference = endTime - now;

    if (difference <= 0) {
      return { timeLeft: "Hết thời gian!", status: "Đấu giá đã kết thúc." };
    }

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    const formattedTime = `${hours.toString().padStart(2, "0")}h:${minutes
      .toString()
      .padStart(2, "0")}m:${seconds.toString().padStart(2, "0")}s`;

    if (now < startTime) {
      return { timeLeft: formattedTime, status: "Đấu giá chưa bắt đầu." };
    } else if (now >= startTime && now <= endTime) {
      return { timeLeft: formattedTime, status: "Vui lòng thanh toán." };
    }

    return { timeLeft: formattedTime, status: "" };
  };

  useEffect(() => {
    if (
      cartauction.length === 0 ||
      cartauction[0].itemAuction.length === 0 ||
      !cartauction[0].itemAuction[0].auctionStartTime ||
      !cartauction[0].itemAuction[0].auctionEndTime
    ) {
      setTimeLeft("Không có dữ liệu đấu giá.");
      setStatus("Không có thông tin đấu giá.");
      return;
    }

    const startTime = new Date(
      cartauction[0].itemAuction[0].auctionStartTime!
    ).getTime();
    const endTime = new Date(
      cartauction[0].itemAuction[0].auctionEndTime!
    ).getTime();

    const updateTimer = () => {
      const { timeLeft, status } = calculateTimeLeft(startTime, endTime);
      setTimeLeft(timeLeft);
      setStatus(status);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [cartauction]);

  return { timeLeft, status };
};

export default useAuctionTimer;
