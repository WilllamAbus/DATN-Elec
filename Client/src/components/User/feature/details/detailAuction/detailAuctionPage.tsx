import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageAuction from "./imageAuction";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { getProductDetailAuctionThunk } from "../../../../../redux/product/client/Thunk";
import ProductName from "./nameAuction";
import ProductPrice from "./priceAuction";
import AuctionTime from "./auctionTime";
import StartAndEndTime from "./startAndEndtime";
import AuctionList from "./auctionList";
import CurrentPriceAndBidprice from "./currentPriceAndBidprice";
import { getBreadcrumbPaths } from "../../../../../ultils/breadcrumb/client/getBreadcrumbPaths";
import ReusableBreadcrumb from "../../../../../ultils/breadcrumb/client/reusableBreadcrumb";
const DetailPageAuction: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { slug } = useParams<{ slug: string }>();
  const category = useSelector(
    (state: RootState) => state.productClient.getProductsByCategory.category
  );
  const { productDetailAuction } = useSelector(
    (state: RootState) => state.productClient.getProductDetailAuction
  );

  useEffect(() => {
    if (slug) {
      dispatch(getProductDetailAuctionThunk({ slug }));
    }
  }, [dispatch, slug]);
  const breadcrumbPaths = getBreadcrumbPaths(category, productDetailAuction?.product_name);
  return (
    <>
      <ReusableBreadcrumb paths={breadcrumbPaths} />
      <section className="py-10 bg-white dark:bg-gray-900 antialiased">
        <div className="max-w-screen-2xl px-4 mx-auto lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {productDetailAuction && (
              <>
                <div className="justify-center items-center bg-white shadow-sm rounded-lg p-4 sm:p-6 h-full">
                  <ImageAuction
                    productDetailAuction={productDetailAuction}
                    product_name={productDetailAuction.product_name || "Sample Product"}
                  />
                </div>
                <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 space-y-6">
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
          <div className="p-1 mb-4 bg-white border border-gray-50 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <AuctionList />
          </div>
        </div>
        <div className="col-span-full xl:col-auto">
          {productDetailAuction && (
            <div className="p-1 mb-4 bg-white border border-gray-50 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              <CurrentPriceAndBidprice product={productDetailAuction} />
            </div>
          )}
        </div>

      </div>
    </>

  );
};

export default DetailPageAuction;
