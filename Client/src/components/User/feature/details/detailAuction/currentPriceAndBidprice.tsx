import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar } from "@nextui-org/react";
import { ProductAuction } from "../../../../../services/detailProductAuction/types/detailAuction";
import { MyButton } from "../../../../../common/customs/MyButton";

interface ProductCurrentPriceAndBidpriceProps {
  product: ProductAuction;
}

const CurrentPriceAndBidprice: React.FC<ProductCurrentPriceAndBidpriceProps> = ({ product }) => {
  const [priceStep] = useState(product.auctionPricing.priceStep);
  const [currentPrice, setCurrentPrice] = useState(product.auctionPricing.currentPrice);
  const [bidCount, setBidCount] = useState(0);
  const [userBidPrice, setUserBidPrice] = useState<number | null>(null);

  const handleBidPrice = () => {
    if (userBidPrice !== null && userBidPrice > currentPrice) {
      setCurrentPrice(userBidPrice);
      setBidCount(bidCount + 1);
    } else {
      alert("Giá trả không hợp lệ!");
    }
  };

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > currentPrice) {
      setUserBidPrice(value);
    } else {
      setUserBidPrice(null);
    }
  };

  useEffect(() => {
    setCurrentPrice(product.auctionPricing.currentPrice);
  }, [product.auctionPricing.currentPrice]);

  return (
    <Card className="max-w-full shadow-none bg-white">
      <CardHeader className="justify-between">
        <div className="flex gap-2 items-center">
          <Avatar radius="full" size="sm" className="border-none" src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/icon%2FOrange%20White%20Modern%20Gradient%20%20IOS%20Icon.svg?alt=media&token=295557b9-f375-481d-be0a-fe85951aa160" />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-bold leading-none text-default-600">Giá hiện tại</h4>
          </div>
        </div>

        <MyButton radius="full" size="xl" variant="transparent">
          {currentPrice.toLocaleString()} đ
        </MyButton>
      </CardHeader>

      <CardBody className="px-3 py-4 text-small text-default-400">
        <div className="flex justify-between items-center gap-4">
          <MyButton
            radius="full"
            size="sm"
            variant="outlined"
            onClick={() => {
              setUserBidPrice(prevBidPrice => {
                const newBidPrice = prevBidPrice !== null && prevBidPrice > priceStep ? prevBidPrice - priceStep : priceStep;
                if (newBidPrice !== priceStep) setBidCount(bidCount - 1);
                return newBidPrice;
              });
            }}
            disabled={userBidPrice === priceStep || userBidPrice === null}
          >
            - Giảm
          </MyButton>

          <div className="inline-flex items-center gap-2">
            <span className="text-default-600 text-medium">Bước giá:</span>
            <input
              type="number"
              className="px-3 py-1 text-sm font-bold rounded-md border-none bg-gray-100"
              value={userBidPrice ?? priceStep}
              onChange={handlePriceInputChange}
            />

          </div>

          <MyButton
            radius="full"
            size="sm"
            variant="outlined"
            onClick={() => {
              setUserBidPrice(prevBidPrice => prevBidPrice !== null ? prevBidPrice + priceStep : priceStep);
              setBidCount(bidCount + 1);
            }}
          >
            + Tăng
          </MyButton>

          <MyButton radius="full" size="sm" variant="gradient">
            {userBidPrice !== null ? (userBidPrice).toLocaleString() + " đ" : priceStep.toLocaleString() + " đ"}
          </MyButton>
        </div>

        <MyButton
          radius="full"
          size="xl"
          variant="gradientBlue"
          className="mt-4"
          onClick={handleBidPrice}
        >
          Trả giá {userBidPrice !== null ? (currentPrice + userBidPrice).toLocaleString() : currentPrice.toLocaleString()} đ
        </MyButton>

        <div className="mt-4">
          <p className="text-default-600">Số lần đã tăng: {bidCount}</p>
        </div>
      </CardBody>

      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">4</p>
          <p className="text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};


export default CurrentPriceAndBidprice;
