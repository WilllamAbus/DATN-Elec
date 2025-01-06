import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageAuction from "./imageAuction";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { getProductDetailAuctionThunk, getAuctionDetailsBySlugThunk, getAuctionPricingRangeThunk, checkStatusAuctionPricingRangeThunk, highBidderInformationThunk, getAuctionProgressThunk, getTop3HighestBiddersThunk, getUserCartThunk } from "../../../../../redux/product/client/Thunk";
import ProductName from "./nameAuction";
import ProductPrice from "./priceAuction";
import AuctionTime from "./auctionTime";
import StartAndEndTime from "./startAndEndtime";
import CurrentPriceAndBidprice from "./currentPriceAndBidprice";
import { getBreadcrumbPaths } from "../../../../../ultils/breadcrumb/client/getBreadcrumbPaths";
import ReusableBreadcrumb from "../../../../../ultils/breadcrumb/client/reusableBreadcrumb";
import AuctionLose from "./auctionLose";
import AuctionWin from "./auctionWin";
import AuctionPending from "./auctionPending";
import AuctionTemporary from "./auctionTemporary";
import FiveMinutesNotice from "./fiveMinutesNotice";
import AuctionTemporaryMaxPrice from "./auctionTemporaryMaxPrice";
import socket from '../../../../../services/rtsk/sk';
import AuctionNotice from "./auctionNotice";
import AppAuctionList from "./appAuctionList/appAuctionList";
import { Bid } from "../../../../../services/detailProductAuction/types/getAuctionProgress";
import AlertCheckStatusCart from "src/common/alert/alertcheckStatusCart";
const DetailPageAuction: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { slug } = useParams<{ slug: string }>();
  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id);
  const category = useSelector(
    (state: RootState) => state.productClient.getProductsByCategory.category
  );
  const { productDetailAuction } = useSelector(
    (state: RootState) => state.productClient.getProductDetailAuction
  );
  const auctionPricing = useSelector(
    (state: RootState) => state.productClient.getProductDetailAuction.productDetailAuction?.auctionPricing
  );
  const highBidderInformation = useSelector(
    (state: RootState) => state.productClient.highBidderInformation.auctionData
  );
  const [auctionStatus, setAuctionStatus] = useState<null | 0 | 1 | 2>(null);
  const [checkAuctionStatusPricingRange, setAuctionStatusPricingRange] = useState<null | 4 | 5>(null);
  const [auctionStatusTop3Bidder, setAuctionStatusTop3Bidder] = useState<null | 9 | 10 | 11>(null);
  const [isAuctionTemporary, setIsAuctionTemporary] = useState(auctionPricing?.status === 'temporary');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const auctionProgress = useSelector((state: RootState) => state.productClient.getAuctionProgress);
  const totalPages = useSelector((state: RootState) => state.productClient.getAuctionProgress.pagination?.totalPages || 1);
  const total = useSelector((state: RootState) => state.productClient.getAuctionProgress.pagination?.total|| 0);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const biddingList: Bid[] = auctionProgress.biddingList || [];
  const [statusCart, setStatusCart] = useState<number>(0);
  const [alertVisible, setAlertVisible] = useState<boolean>(true);
  useEffect(() => { if (slug) { dispatch(getProductDetailAuctionThunk({ slug }));} }, [dispatch, slug]);
  useEffect(() => { if (slug) { setIsLoading(true); dispatch(getAuctionProgressThunk({ slug, page: currentPage })).then(() => setIsLoading(false)); } }, [dispatch, slug, currentPage]);
  useEffect(() => {
    socket.on('topBiddersUpdate', (data) => {
     
      if (data.slug === slug) {
        dispatch(getAuctionProgressThunk({ slug: slug as string, page: currentPage }));
      }
    });

    return () => {
      socket.off('topBiddersUpdate');
    };
  }, [slug, dispatch, currentPage]);

  
    const userCart = useSelector((state: RootState) => state.productClient.getUserCart.cart);
    useEffect(() => { dispatch(getUserCartThunk()); }, [dispatch]);
    useEffect(() => {
      const checkStatusCart = (): number => {
        if (userCart && userCart.user === userId) {
          if (userCart.itemAuction && userCart.itemAuction.length > 0) {
            return 1; 
          } else if (userCart.items && userCart.items.length > 0) {
            return 2; 
          }
        }
        return 0; 
      };
      setStatusCart(checkStatusCart());
    }, [userCart, userId]);
  const handlePageChange = (newPage: number) => { setCurrentPage(newPage); };
  const breadcrumbPaths = getBreadcrumbPaths(category, productDetailAuction?.product_name);
  const isAuctionEnded = productDetailAuction?.auctionPricing.status === 'ended';

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
  console.log(auctionStatusTop3Bidder);

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

  const handleTop3BidderChange = async () => {
    if (slug) {
      const result = await dispatch(getTop3HighestBiddersThunk({ slug }));
      if (result.payload && typeof result.payload !== "string") {
        const userBidder = result.payload.topBidders.find((bidder) => bidder.user._id === userId);
        const statusCode = userBidder?.status;
        setAuctionStatusTop3Bidder(statusCode === "topOne" ? 9 : statusCode === "topTwo" ? 10 : statusCode === "topThree" ? 11 : null);

        if (statusCode === "topOne") {
          await dispatch(getAuctionProgressThunk({ slug, page: currentPage }));
        }
      }
    }
  };


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

          const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((remainingTime % (1000 * 60)) / (1000 * 60));
          const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

          console.log(`${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`);

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

  return (
    <>
      <ReusableBreadcrumb paths={breadcrumbPaths} />

      <section className="py-10 bg-white dark:bg-gray-900 antialiased">
        <div className="max-w-screen-2xl px-4 mx-auto lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {productDetailAuction && (
              <>
                <div className={`justify-center items-center bg-white shadow-sm rounded-lg p-4 sm:p-6 h-full ${isAuctionEnded ? 'opacity-50 pointer-events-none' : ''}`}>
                  <ImageAuction
                    productDetailAuction={productDetailAuction}
                    product_name={productDetailAuction.product_name || "Sample Product"}
                  />
                </div>
                <div className={`bg-white shadow-sm rounded-lg p-4 sm:p-6 space-y-6 ${isAuctionEnded ? 'opacity-50 pointer-events-none' : ''}`}>
                  <ProductName product={productDetailAuction} />
                  <StartAndEndTime product={productDetailAuction} />
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <AuctionNotice />
                  <ProductPrice product={productDetailAuction} />
                  <AuctionTime />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {isAuctionTemporary && (
        <div className="grid grid-cols-1 px-4 pt-4 xl:grid-cols-1 xl:gap-4 dark:bg-gray-900">
          <FiveMinutesNotice highBidderInformation={highBidderInformation} visible={isAuctionTemporary} />
        </div>
      )}

      <div className="grid grid-cols-[1fr_1fr] px-4 pt-4 xl:grid-cols-[1fr_1fr] xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className={`p-1 mb-4 bg-white border border-gray-50 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 ${isAuctionEnded ? 'opacity-50 pointer-events-none' : ''}`}>
            <AppAuctionList
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              hasPrevPage={hasPrevPage}
              hasNextPage={hasNextPage}
              biddingList={biddingList}
              isLoading={isLoading}
              total={total}
            />
          </div>
        </div>

        <div className="col-span-full xl:col-auto">
        {statusCart === 1 && <AlertCheckStatusCart visible={alertVisible} setVisible={setAlertVisible} />}
          {productDetailAuction && (
            <div className={`p-1 mb-4 bg-white border border-gray-50 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 ${isAuctionEnded || isAuctionTemporary ? 'opacity-50 pointer-events-none' : ''}`}>
              <CurrentPriceAndBidprice
                product={productDetailAuction}
                onAuctionEnd={handleAuctionEnd}
                onChange={handleBidPriceChange}
                onChangeTemporary={handleTemporaryChange}
                onChangeTop3Bidder={handleTop3BidderChange}
              />
            </div>
            
          )}
        </div>

      </div>


      {auctionStatus === 0 && <AuctionWin />}
      {auctionStatus === 1 && <AuctionPending />}
      {auctionStatus === 2 && <AuctionLose />}
      {checkAuctionStatusPricingRange === 4 && <AuctionTemporaryMaxPrice />}
      {checkAuctionStatusPricingRange === 5 && <AuctionTemporary />}
     
    </>
  );
};

export default DetailPageAuction;
