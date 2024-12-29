import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Chip, Alert } from "@nextui-org/react";
import { ProductAuction } from "../../../../../services/detailProductAuction/types/detailAuction";
import { MyButton } from "../../../../../common/customs/MyButton";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { handleBidSubmission } from "./handle/handleBidSubmission";
import socket from '../../../../../services/rtsk/sk'; // This is where the socket connection is imported
import { convertToVietnameseCurrency } from "src/common/pricecurrency/ConvertToVietnameseCurrency";
import { getAuctionPricingRangeThunk } from "../../../../../redux/product/client/Thunk";

interface ProductCurrentPriceAndBidpriceProps {
  product: ProductAuction;
  onAuctionEnd: () => void;
  onChange: () => void;
}

const CurrentPriceAndBidprice: React.FC<ProductCurrentPriceAndBidpriceProps> = ({ product, onAuctionEnd, onChange }) => {
  const [priceStep, setPriceStep] = useState<number>(product.auctionPricing.priceStep ?? 0);
  const [currentPrice, setCurrentPrice] = useState<number>(product.auctionPricing.currentPrice ?? 0);
  const [isPriceStepAdjusted, setIsPriceStepAdjusted] = useState<boolean>(false);
  const navigate = useNavigate();
  const [userBidPrice, setUserBidPrice] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id) || "";

  const updateAuctionPricing = async () => {
    const result = await dispatch(getAuctionPricingRangeThunk({ slug: product.slug }));
    if (result.payload && typeof result.payload !== "string") {
      setPriceStep(result.payload.auctionPricing.priceStep ?? 0);
      setCurrentPrice(result.payload.auctionPricing.currentPrice ?? 0);
      setIsPriceStepAdjusted(result.payload.auctionPricing.isPriceStepAdjusted ?? false);
    }
  };

  useEffect(() => {
    updateAuctionPricing();
  }, [product]);

  useEffect(() => {
    socket.on('auctionPriceUpdated', async (data) => {
      if (data.productSlug === product.slug) {
        await updateAuctionPricing();
        if (data.status === 'ended') {
          onAuctionEnd(); // Handle auction end
        }
      }
    });

    return () => {
      socket.off('auctionPriceUpdated'); // Clean up the listener on unmount
    };
  }, [product.slug, onAuctionEnd]);

  useEffect(() => {
    socket.on('bidPlaced', async (data) => {
      if (data.slug === product.slug) {
        await updateAuctionPricing();

        if (data.status === 'ended') {
          onAuctionEnd();
        }

        if (data.userId !== userId) {
          toast.success(data.message);
        }
      }
    });

    return () => {
      socket.off('bidPlaced');
    };
  }, [product.slug, userId, navigate]);

  const handleSubmitBidPrice = async () => {
    if (!product.slug) {
      toast.error("Slug của sản phẩm không hợp lệ.");
      return;
    }
    await handleBidSubmission({ ...product, slug: product.slug as string }, userBidPrice, priceStep, currentPrice, dispatch, userId, setCurrentPrice, setUserBidPrice);
    onChange(); // Gọi hàm onChange khi submit
  };

  return (
    <>
      <Toaster />
      <Card className="max-w-full shadow-none bg-white">
        <CardHeader className="justify-between">
          <div className="flex gap-2 items-center">
            <Avatar
              radius="full"
              size="sm"
              className="border-none"
              src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/icon%2FOrange%20White%20Modern%20Gradient%20%20IOS%20Icon.svg?alt=media&token=295557b9-f375-481d-be0a-fe85951aa160"
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-bold leading-none text-default-600">Giá hiện tại</h4>
            </div>
          </div>

          <MyButton radius="full" size="xl" variant="transparent">
            {(currentPrice || 0).toLocaleString()} đ
          </MyButton>
        </CardHeader>

        <CardBody className="px-3 py-4 text-small text-default-400">
          <div className="flex justify-between items-center gap-4">
 
            <div className="inline-flex items-center gap-2">
              <span className="text-default-600 text-medium font-bold">Bước giá:</span>
              <Chip className="px-3 py-1 text-sm font-bold rounded-md border-none" isDisabled>
                {convertToVietnameseCurrency(priceStep)}
              </Chip>
            </div>

            <MyButton radius="full" size="sm" variant="gradient">
              {userBidPrice !== null
                ? userBidPrice.toLocaleString() + " đ"
                : priceStep.toLocaleString() + " đ"}
            </MyButton>
          </div>
          <div className="mt-2">
          {isPriceStepAdjusted && (
            <Alert 
              hideIcon 
              color="warning" 
              description="Do quá trình đấu giá tạo ra số lẻ nên hệ thống sẽ điều chỉnh lại bước giá."
              title="Chú ý"
              variant="faded" 
            
            />
          )}
          </div>
        
          <MyButton
            radius="full"
            size="xl"
            variant="gradientBlue"
            className="mt-4"
            onClick={handleSubmitBidPrice}
          >
            Trả giá {(currentPrice + (userBidPrice !== null ? userBidPrice : priceStep)).toLocaleString()} đ
          </MyButton>
        </CardBody>

        <CardFooter className="gap-3">
        </CardFooter>
      </Card>
    </>
  );
};

export default CurrentPriceAndBidprice;
