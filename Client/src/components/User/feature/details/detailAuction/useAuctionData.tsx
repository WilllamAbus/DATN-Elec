import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { getProductDetailAuctionThunk, getAuctionDetailsBySlugThunk, getAuctionPricingRangeThunk, checkStatusAuctionPricingRangeThunk, highBidderInformationThunk } from "../../../../../redux/product/client/Thunk";
import socket from '../../../../../services/rtsk/sk';

const useAuctionData = () => {
  const dispatch: AppDispatch = useDispatch();
  const { slug } = useParams<{ slug: string }>();
  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id);
  const category = useSelector((state: RootState) => state.productClient.getProductsByCategory.category);
  const { productDetailAuction } = useSelector((state: RootState) => state.productClient.getProductDetailAuction);
  const auctionPricing = useSelector((state: RootState) => state.productClient.getProductDetailAuction.productDetailAuction?.auctionPricing);
  const highBidderInformation = useSelector((state: RootState) => state.productClient.highBidderInformation.auctionData);
  const [auctionStatus, setAuctionStatus] = useState<null | 0 | 1 | 2>(null);
  const [checkAuctionStatusPricingRange, setAuctionStatusPricingRange] = useState<null | 4 | 5>(null);
  const [isAuctionTemporary, setIsAuctionTemporary] = useState(auctionPricing?.status === 'temporary');

  useEffect(() => {
    if (slug) {
      dispatch(getProductDetailAuctionThunk({ slug }));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    socket.on('auctionStatusChange', (data) => {
      if (data.status === 'temporary') {
        setIsAuctionTemporary(true);
      } else if (data.status === 'active') {
        setIsAuctionTemporary(false);
      }
    });

    return () => {
      socket.off('auctionStatusChange');
    };
  }, []);

  useEffect(() => {
    const updateAuctionTemporaryStatus = () => {
      if (auctionPricing?.status !== 'temporary') {
        setIsAuctionTemporary(false);
      }
    };
    updateAuctionTemporaryStatus();
  }, [auctionPricing]);

  useEffect(() => {
    if (isAuctionTemporary) {
      const checkRemainingTime = async () => {
        if (auctionPricing && auctionPricing.endTime && slug) {
          const endTime = new Date(auctionPricing.endTime).getTime();
          const remainingTime = endTime - new Date().getTime();

          if (remainingTime <= 0) {
            await dispatch(highBidderInformationThunk({ slug }));
            await dispatch(getProductDetailAuctionThunk({ slug }));
            setIsAuctionTemporary(false);
          }
        }
      };

      const interval = setInterval(checkRemainingTime, 1000);
      return () => clearInterval(interval);
    }
  }, [dispatch, auctionPricing, slug, isAuctionTemporary]);

  const handleAuctionEnd = async () => {
    if (slug) {
      const result = await dispatch(getAuctionDetailsBySlugThunk({ slug }));
      if (result.payload && typeof result.payload !== "string") {
        const userBidder = result.payload.bidders.find((bidder) => bidder.user._id === userId);
        const statusCode = userBidder?.statusCode;
        setAuctionStatus(statusCode as 0 | 1 | 2 | null);
      }
    }
  };

  const handleBidPriceChange = async () => {
    if (slug) {
      const result = await dispatch(getAuctionPricingRangeThunk({ slug }));
      if (result.payload && typeof result.payload !== "string") {
        const auctionPricing = result.payload.auctionPricing;
        const currentPrice = auctionPricing.currentPrice;
        const priceStep = auctionPricing.priceStep;
        const maxPrice = auctionPricing.maxPrice;
        const newPrice = currentPrice + priceStep;
        if (newPrice > maxPrice) {
          auctionPricing.priceStep = maxPrice - currentPrice;
        }
      }
    }
  };

  const handleTemporaryChange = async () => {
    if (slug) {
      await dispatch(getProductDetailAuctionThunk({ slug }));
      const result = await dispatch(checkStatusAuctionPricingRangeThunk({ slug }));
      if (result.payload && typeof result.payload !== "string") {
        const userBidder = result.payload.bidders.find((bidder) => bidder.user._id === userId);
        const statusCode = userBidder?.statusCode;
        setAuctionStatusPricingRange(statusCode as 4 | 5 | null);

        await dispatch(highBidderInformationThunk({ slug }));
      }
    }
  };

  return {
    productDetailAuction,
    auctionPricing,
    highBidderInformation,
    auctionStatus,
    checkAuctionStatusPricingRange,
    isAuctionTemporary,
    handleAuctionEnd,
    handleBidPriceChange,
    handleTemporaryChange,
    category
  };
};

export default useAuctionData;
