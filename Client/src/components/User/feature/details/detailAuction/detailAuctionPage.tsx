import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import ImageAuction from "./imageAuction";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { getProductDetailAuctionThunk, getAuctionDetailsBySlugThunk, getAuctionPricingRangeThunk, checkStatusAuctionPricingRangeThunk, highBidderInformationThunk, getAuctionProgressThunk, getTop3HighestBiddersThunk, getUserCartThunk, checkAuctionTimeThunk, emailTwowinnerThunk } from "../../../../../redux/product/client/Thunk";
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
import AuctionStatusOutOfTime0 from "./auctionStatusOutOfTime0";
import AuctionStatusOutOfTime1 from "./auctionStatusOutOfTime1";
import AuctionStatusOutOfTime2 from "./auctionStatusOutOfTime2";
import AuctionStatusOutOfTime3 from "./auctionStatusOutOfTime3";
import AuctionStatusOutOfTime4 from "./auctionStatusOutOfTime4";
import AuctionEnded4 from "./auctionEnded4";
import AuctionWin0 from "./auctionWin0";
import AuctionWait1 from "./auctionWait";
import AuctionBetterLuckNextTime2 from "./auctionBetterLuckNextTime1";
import TheAuctionContinues from "./TheAuctionContinues";
import RelatedProduct from "../detalsListting/relatedProduct/relatedProduct";
import PaidAuctionIsOver from "./paidAuctionIsOver";
const DetailPageAuction: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const slug = useParams<{ slug: string }>().slug ?? ''
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
  const [statuscheckAuctionTime, setStatuscheckAuctionTime] = useState<null | 0 | 1 | 2 | 3 | 4 | 5>(null);
  const [auctionCanceled, setAuctionCanceled] = useState(false)
  const [showPaidAuctionModal, setShowPaidAuctionModal] = useState(false);
  const [isAuctionTemporary, setIsAuctionTemporary] = useState(auctionPricing?.status === 'temporary');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const auctionProgress = useSelector((state: RootState) => state.productClient.getAuctionProgress);
  const totalPages = useSelector((state: RootState) => state.productClient.getAuctionProgress.pagination?.totalPages || 1);
  const total = useSelector((state: RootState) => state.productClient.getAuctionProgress.pagination?.total || 0);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const biddingList: Bid[] = auctionProgress.biddingList || [];
  const [statusCart, setStatusCart] = useState<number>(0);
  const [alertVisible, setAlertVisible] = useState<boolean>(true);
  useEffect(() => { if (slug) { dispatch(getProductDetailAuctionThunk({ slug })); } }, [dispatch, slug]);
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

  useEffect(() => {
    socket.on('auctionCanceled', (data) => {
      if (data.slug === slug) {
        setAuctionCanceled(true);
        setStatuscheckAuctionTime(null);
        dispatch(getProductDetailAuctionThunk({ slug }));
        dispatch(getAuctionProgressThunk({ slug, page: currentPage }));
      }
    });

    return () => {
      socket.off('auctionCanceled');
    };
  }, [dispatch, slug]);

  useEffect(() => {
    socket.on('auctionPaid', (data) => {
      if (data.slug === slug) {
        setShowPaidAuctionModal(true);
        setStatuscheckAuctionTime(3);
        dispatch(getProductDetailAuctionThunk({ slug }));
        dispatch(getAuctionProgressThunk({ slug, page: currentPage }));
        setTimeout(() => { setShowPaidAuctionModal(false); navigate("/auction"); }, 10000);
      }
    });

    return () => {
      socket.off('auctionPaid');
    };
  }, [slug, dispatch, currentPage]);




  const handleAuctionTimeChange = async () => {
    if (slug) {
      const auctionTimeResult = await dispatch(checkAuctionTimeThunk({ slug }));
      if (auctionTimeResult.payload && typeof auctionTimeResult.payload !== "string") {

        // Lọc các bidder có statusCheckAuctionTime là 0, 1 hoặc 2, cần so sánh với userId
        const userBidder = auctionTimeResult.payload.bidders.find(
          (bidder) => (bidder.statusCheckAuctionTime === 0 || bidder.statusCheckAuctionTime === 1 || bidder.statusCheckAuctionTime === 2)
            && bidder.user?._id === userId
        );

        // Lọc các bidder có statusCheckAuctionTime là 3, 4 hoặc 5, không cần so sánh với userId
        const publicBidder = auctionTimeResult.payload.bidders.find(
          (bidder) => bidder.statusCheckAuctionTime === 3 || bidder.statusCheckAuctionTime === 4 || bidder.statusCheckAuctionTime === 5
        );

        // Kiểm tra và lấy thông tin từ bidder người dùng hoặc từ bidder công khai
        const bidder = userBidder || publicBidder;

        if (bidder) {
          const statusCheckAuctionTime = bidder.statusCheckAuctionTime;

          if (statusCheckAuctionTime !== undefined && statusCheckAuctionTime !== statuscheckAuctionTime) {
            setStatuscheckAuctionTime(statusCheckAuctionTime as 0 | 1 | 2 | 3 | 4 | 5 | null);

            // Gọi lại hàm getProductDetailAuctionThunk nếu statusCheckAuctionTime là 5
            if (statusCheckAuctionTime === 5) {
              await dispatch(getProductDetailAuctionThunk({ slug }));
            }
            handleModal(statusCheckAuctionTime);
          }
        }
      }
    }
  };
  const handleModal = async (statusCheckAuctionTime: number) => {
    switch (statusCheckAuctionTime) {
      case 0:
        if (slug) {
          await dispatch(getProductDetailAuctionThunk({ slug }));
        }
        if (slug) {
          await dispatch(emailTwowinnerThunk({ slug }));
        }
        break;
      case 1:
        if (slug) {
          await dispatch(getProductDetailAuctionThunk({ slug }));
        }
        if (slug) {
          await dispatch(emailTwowinnerThunk({ slug }));
        }
        showAuctionWaitModal();
        break;
      case 2:
        if (slug) {
          await dispatch(getProductDetailAuctionThunk({ slug }));
        }
        showAuctionBetterLuckNextTimeModal();
        break;
      case 3:
        showPaidAuctionIsOverModal();
        break;
      case 4:
        if (slug) {
          await dispatch(getProductDetailAuctionThunk({ slug }));
        }
        setTimeout(() => {
          showAuctionEndedModal();
          navigate("/auction");
        }, 9000);
        break;
      case 5:
        showTheAuctionContinuesModal();
        break;
      default:

    }
  };

  const showAuctionEndedModal = () => { return <AuctionEnded4 />; };
  const showAuctionWinModal = () => { return <AuctionWin0 />; };
  const showAuctionWaitModal = () => { return <AuctionWait1 />; };
  const showAuctionBetterLuckNextTimeModal = () => { return <AuctionBetterLuckNextTime2 />; };
  const showTheAuctionContinuesModal = () => { return <TheAuctionContinues onClose={() => setAuctionCanceled(false)} />; };
  const showPaidAuctionIsOverModal = () => { return <PaidAuctionIsOver onClose={() => setShowPaidAuctionModal(false)} />; };


  useEffect(() => {
    socket.on('auctionStatusOutOfTime', (data: { status: string }) => {
      if (data.status === 'outOfTime') {
        console.log("Socket Event: auctionStatusOutOfTime");
        handleAuctionTimeChange();
      }
    });

    socket.on('auctionStatusInProgress', (data: { status: string }) => {
      if (data.status === 'inProgress') {
        console.log("Socket Event: auctionStatusInProgress");
        handleAuctionTimeChange();
      }
    });

    socket.on('auctionStatusHasWinner', (data: { status: string }) => {
      if (data.status === 'endedWithWinner') {
        console.log("Socket Event: auctionStatusHasWinner");
        handleAuctionTimeChange();
      }
    });

    socket.on('auctionStatusNoWinner', (data: { status: string }) => {
      if (data.status === 'endedNoWinner') {
        console.log("Socket Event: auctionStatusNoWinner");
        handleAuctionTimeChange();
      }
    });

    socket.on('auctionStatusPaid', (data: { status: string }) => {
      if (data.status === 'paid') {
        console.log("Socket Event: auctionStatusPaid");
        handleAuctionTimeChange();
      }
    });

    socket.on('auctionStatusTemporary', (data: { status: string }) => {
      if (data.status === 'temporary') {
        console.log("Socket Event: auctionStatusTemporary");
        handleAuctionTimeChange();
      }
    });

    return () => {
      socket.off('auctionStatusOutOfTime');
      socket.off('auctionStatusInProgress');
      socket.off('auctionStatusHasWinner');
      socket.off('auctionStatusNoWinner');
      socket.off('auctionStatusPaid');
      socket.off('auctionStatusTemporary');
    };
  }, [socket, slug]);

  useEffect(() => {
    console.log("statuscheckAuctionTime:", statuscheckAuctionTime);
  }, [statuscheckAuctionTime]);


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
                  {statuscheckAuctionTime === null && (
                    <AuctionTime onChangeCheckAuctionTimeAuctionPricingRange={handleAuctionTimeChange} />
                  )}
                  {statuscheckAuctionTime === 0 && <AuctionStatusOutOfTime0 />}
                  {statuscheckAuctionTime === 1 && <AuctionStatusOutOfTime1 />}
                  {statuscheckAuctionTime === 2 && <AuctionStatusOutOfTime2 />}
                  {statuscheckAuctionTime === 3 && <AuctionStatusOutOfTime3 />}
                  {statuscheckAuctionTime === 4 && <AuctionStatusOutOfTime4 />}

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
            <div className={`p-1 mb-4 bg-white border border-gray-50 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 ${isAuctionEnded || isAuctionTemporary || statuscheckAuctionTime === 3 ? 'opacity-50 pointer-events-none' : ''}`}>
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
      <div className="grid grid-cols-[1fr_1fr] px-4 pt-4 xl:grid-cols-[1fr_1fr] xl:gap-4 dark:bg-gray-900">
        <RelatedProduct />
      </div>
      {auctionStatus === 0 && <AuctionWin />}
      {auctionStatus === 1 && <AuctionPending />}
      {auctionStatus === 2 && <AuctionLose />}
      {checkAuctionStatusPricingRange === 4 && <AuctionTemporaryMaxPrice />}
      {checkAuctionStatusPricingRange === 5 && <AuctionTemporary />}
      <motion.div initial={{ opacity: 0, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.6 }} >
        {statuscheckAuctionTime === 4 && showAuctionEndedModal()}
        {statuscheckAuctionTime === 0 && showAuctionWinModal()}
        {statuscheckAuctionTime === 1 && showAuctionWaitModal()}
        {statuscheckAuctionTime === 2 && showAuctionBetterLuckNextTimeModal()}
        {statuscheckAuctionTime === 5 && showTheAuctionContinuesModal()}
        {auctionCanceled && showTheAuctionContinuesModal()}
        {showPaidAuctionModal && showPaidAuctionIsOverModal()}
      </motion.div>


    </>
  );
};

export default DetailPageAuction;
