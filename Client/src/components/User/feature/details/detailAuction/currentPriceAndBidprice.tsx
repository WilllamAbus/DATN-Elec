import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Chip } from "@nextui-org/react";
import { ProductAuction } from "../../../../../services/detailProductAuction/types/detailAuction";
import { MyButton } from "../../../../../common/customs/MyButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { createOneUpdateBidAuctionThunk } from "../../../../../redux/product/client/Thunk";
import { toast, Toaster } from "react-hot-toast";
import { io } from 'socket.io-client';
import { convertToVietnameseCurrency } from "../../../../../common/pricecurrency/ConvertToVietnameseCurrency";

const socket = io('http://localhost:4000'); 

interface ProductCurrentPriceAndBidpriceProps {
  product: ProductAuction;
}

const CurrentPriceAndBidprice: React.FC<ProductCurrentPriceAndBidpriceProps> = ({ product }) => {
  const [priceStep] = useState<number>(product.auctionPricing.priceStep ?? 0);
  const [currentPrice, setCurrentPrice] = useState<number>(product.auctionPricing.currentPrice ?? 0);

  const [userBidPrice, setUserBidPrice] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id);

  useEffect(() => {
    setCurrentPrice(product.auctionPricing.currentPrice ?? 0);
  }, [product.auctionPricing.currentPrice]);

  useEffect(() => {
    socket.on('bidPlaced', (data) => {
      if (data.slug === product.slug) {
        setCurrentPrice(data.bidPrice);
        if (data.userId !== userId) {
          toast.success(data.message);
        }
      }
    });

    return () => {
      socket.off('bidPlaced');
    };
  }, [product.slug, userId]);

  const handleSubmitBidPrice = async () => {
    const bidPrice = userBidPrice ?? priceStep;
    const newPrice = currentPrice + bidPrice;
    const previousPrice = currentPrice; // Lưu lại giá trị trước đó để khôi phục nếu có lỗi

    setCurrentPrice(newPrice);
    setUserBidPrice(null);
   

    try {
      const resultAction = await dispatch(
        createOneUpdateBidAuctionThunk({ slug: product.slug, bidPrice: newPrice })
      );

      if (createOneUpdateBidAuctionThunk.fulfilled.match(resultAction)) {
        if (resultAction.payload && typeof resultAction.payload !== 'string') {
          if (resultAction.payload.userId !== userId) {
            toast.success(resultAction.payload.msg || "Đã đấu giá thành công!");
          }
        } else {
          // Nếu phản hồi không hợp lệ, khôi phục giá trị trước đó
          setCurrentPrice(previousPrice);
          toast.error("Không có dữ liệu trả về từ máy chủ hoặc phản hồi không hợp lệ.");
        }
      } else {
        const errorMessage =
          typeof resultAction.payload === 'string'
            ? resultAction.payload
            : resultAction.payload?.msg ?? "Có gì đó không ổn!";

        // Nếu có lỗi từ backend, khôi phục giá trị trước đó
        setCurrentPrice(previousPrice);
        toast.error(errorMessage);
      }
    } catch (error) {
      // Nếu có lỗi từ backend, khôi phục giá trị trước đó
      setCurrentPrice(previousPrice);
      toast.error("Lỗi khi gửi giá thầu: " + error);
    }
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
            {currentPrice.toLocaleString()} đ
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

          <MyButton
            radius="full"
            size="xl"
            variant="gradientBlue"
            className="mt-4"
            onClick={handleSubmitBidPrice}
          >
            Trả giá {(currentPrice + (userBidPrice ?? priceStep)).toLocaleString()} đ
          </MyButton>


        </CardBody>

        <CardFooter className="gap-3">
        
        </CardFooter>
      </Card>
    </>
  );
};

export default CurrentPriceAndBidprice;
