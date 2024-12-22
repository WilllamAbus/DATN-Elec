import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { ProductAuction } from "../../../../../services/detailProductAuction/types/detailAuction";

interface ProductAuctionTimeProps {
  product: ProductAuction;
}

const AuctionTime: React.FC<ProductAuctionTimeProps> = ({ product }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const endTime = new Date(product.auctionPricing.endTime).getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("Hết thời gian!");
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}h:${minutes
            .toString()
            .padStart(2, "0")}m:${seconds.toString().padStart(2, "0")}s`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <Card className="max-w-full shadow-sm bg-red-50 pt-10 pb-10">
      <CardBody className="text-left">
        <label className="block mb-2 text-sm text-center font-medium text-gray-900 dark:text-white">
          Thời gian còn lại:
        </label>
        <div className="text-2xl text-center font-bold text-red-600 dark:text-white">
          {timeLeft}
        </div>
      </CardBody>
    </Card>



  );
};

export default AuctionTime;
