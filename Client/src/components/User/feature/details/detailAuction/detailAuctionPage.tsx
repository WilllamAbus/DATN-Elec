import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageAuction from "./imageAuction";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { getProductDetailAuctionThunk, getAuctionDetailsBySlugThunk,getAuctionPricingRangeThunk} from "../../../../../redux/product/client/Thunk";
import ProductName from "./nameAuction";
import ProductPrice from "./priceAuction";
import AuctionTime from "./auctionTime";
import StartAndEndTime from "./startAndEndtime";
// import AuctionList from "./auctionList";
import CurrentPriceAndBidprice from "./currentPriceAndBidprice";
import { getBreadcrumbPaths } from "../../../../../ultils/breadcrumb/client/getBreadcrumbPaths";
import ReusableBreadcrumb from "../../../../../ultils/breadcrumb/client/reusableBreadcrumb";
import AuctionLose from "./auctionLose";
import AuctionWin from "./auctionWin";
import AuctionPending from "./auctionPending";

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
  const [auctionStatus, setAuctionStatus] = useState<null | 0 | 1 | 2>(null);

  useEffect(() => {
    if (slug) {
      dispatch(getProductDetailAuctionThunk({ slug }));
    }
  }, [dispatch, slug]);

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

  const handleBidPriceChange = async () => {
    if (slug) {
      const result = await dispatch(getAuctionPricingRangeThunk({ slug }));
      if (result.payload && typeof result.payload !== "string") {
        const auctionPricing = result.payload.auctionPricing;
        const currentPrice = auctionPricing.currentPrice;
        const priceStep = auctionPricing.priceStep;
        const maxPrice = auctionPricing.maxPrice;

        // Điều chỉnh priceStep sao cho vừa đủ để đạt giá tối đa
        const newPrice = currentPrice + priceStep;
        if (newPrice > maxPrice) {
          auctionPricing.priceStep = maxPrice - currentPrice;
          
        }
      }
    }
  };
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
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Sản phẩm đang trong giai đoạn đấu giá. Hãy đảm bảo bạn đặt giá phù hợp!</p>
                    <p className="mt-2">
                      Mọi thông tin chi tiết, vui lòng liên hệ với chúng tôi để biết thêm thông tin.
                    </p>
                  </div>
                  <ProductPrice product={productDetailAuction} />
                  <AuctionTime product={productDetailAuction} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <div className="grid grid-cols-[1fr_1fr] px-4 pt-4 xl:grid-cols-[1fr_1fr] xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className={`p-1 mb-4 bg-white border border-gray-50 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 ${isAuctionEnded ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* <AuctionList /> */}
          </div>
        </div>
        <div className="col-span-full xl:col-auto">
          {productDetailAuction && (
            <div className={`p-1 mb-4 bg-white border border-gray-50 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 ${isAuctionEnded ? 'opacity-50 pointer-events-none' : ''}`}>
              <CurrentPriceAndBidprice product={productDetailAuction} onAuctionEnd={handleAuctionEnd} onChange={handleBidPriceChange} />
            </div>
          )}
        </div>
      </div>
      {auctionStatus === 0 && <AuctionWin  />}
      {auctionStatus === 1 && <AuctionPending />}
      {auctionStatus === 2 && <AuctionLose  />}
    </>
  );
};

export default DetailPageAuction;
