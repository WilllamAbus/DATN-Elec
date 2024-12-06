import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  breadcrumbItemClient,
  ReusableBreadcrumbClient,
} from "../../../../../ultils/breadcrumb";
import { Star } from "./svg";
import VariantImageGallery from "./cpnDetailPage/VariantImageGallery";
import FavoriteButton from "./cpnDetailPage/FavoriteButton";
import AddToCartButton from "./cpnDetailPage/AddToCartButton";

import VariantName from "./cpnDetailPage/VariantName";
import VariantPrice from "./cpnDetailPage/VariantPrice";
import {
  FilterState,
  QueryParamAuction,
} from "../../../../../services/detailProduct/types/getDetailProduct";
import DetailFilters from "./detaiFilter";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { getProductDetailThunk } from "../../../../../redux/product/client/Thunk";
import NotFoundProduct from "../../../../../error/404/NotFoundProduct";
import RelatedProduct from "./relatedProduct/relatedProduct";
import Comment from "../../../../User/feature/details/comment/comment";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Blog from "./blog";
import ProductsInTheSameSegment from "./productsInTheSameSegment/productsInTheSameSegment";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
const DetailPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = queryString.parse(location.search);

  // Hàm để cập nhật average rating

  const { productDetail } = useSelector(
    (state: RootState) => state.productClient.getProductDetail
  );

  const [filters, setFilters] = useState<FilterState>({
    storage: queryParams.storage ? String(queryParams.storage) : "",
    color: queryParams.color ? String(queryParams.color) : "",
  });
  const [selectedColor] = useState<string | null>(null);

  useEffect(() => {
    const hasFilters = Object.values(filters).some((value) => value !== "");

    if (!hasFilters) {
      navigate({ pathname: location.pathname });
    } else {
      navigate({
        pathname: location.pathname,
        search: queryString.stringify(filters),
      });
    }
  }, [navigate, filters, location.pathname]);

  useEffect(() => {
    const newQueryParams: QueryParamAuction = {};
    if (filters.storage?.length) {
      newQueryParams.storage = filters.storage;
    }
    if (filters.color?.length) {
      newQueryParams.color = filters.color;
    }

    navigate({
      pathname: window.location.pathname,
      search: queryString.stringify(newQueryParams),
    });
  }, [navigate, filters]);

  useEffect(() => {
    if (slug) {
      dispatch(
        getProductDetailThunk({
          slug,
          storage: filters.storage || undefined,
          color: filters.color || undefined,
        })
      );
    }
  }, [slug, dispatch, filters.storage, filters.color]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters((prevFilters) => {
      if (newFilters.storage && newFilters.storage !== prevFilters.storage) {
        // Reset color filter khi thay đổi storage
        return { ...newFilters, color: "" };
      }
      return { ...prevFilters, ...newFilters };
    });
  }, []);

  const firstVariant = productDetail?.variants?.length
    ? productDetail.variants[0]
    : null;
  if (!productDetail || productDetail.variants?.length === 0) {
    return <NotFoundProduct />;
  }

  return (
    <>
      <ReusableBreadcrumbClient items={breadcrumbItemClient.productlist} />
      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          {firstVariant && (
            <>
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                <VariantImageGallery
                  variants={productDetail?.variants || []}
                  product_name={productDetail?.product_name || ""}
                  selectedColor={selectedColor}
                />
                <div className="mt-6 sm:mt-8 lg:mt-0">
                  {firstVariant && (
                    <>
                      <VariantName
                        variant={firstVariant}
                        product={productDetail || {}}
                      />

                      <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                        <VariantPrice
                          variant={firstVariant}
                          product={productDetail || {}}
                        />
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <div className="flex items-center gap-1">
                            <Star />
                          </div>
                          <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                            {productDetail.product_ratingAvg} trên 5
                          </p>
                          <a
                            href="#"
                            className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                          >
                            {productDetail?.variants?.[0]?.viewCount} Lượt xem
                          </a>
                        </div>
                      </div>
                      <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                        <FavoriteButton />
                        <AddToCartButton productId={productDetail?._id} />
                        {/* <AddToCartButton /> */}
                      </div>
                      <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                      <div className="grid grid-cols-1 gap-6 mt-6">
                        <DetailFilters
                          filters={filters}
                          onChange={handleFilterChange}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        {/* <ToastContainer /> */}
      </section>
      <div className="grid grid-cols-[2fr_1fr] px-4 pt-4 xl:grid-cols-[2fr_1fr] xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <Blog post={productDetail.posts} />
          </div>
        </div>
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <ProductsInTheSameSegment />
          </div>
        </div>
      </div>
      <section>
        {/* <Comment onUpdateAverageRating={handleUpdateAverageRating} /> */}
        <Comment />
      </section>
      <section>
        <RelatedProduct />
      </section>
      <ToastContainer />
    </>
  );
};

export default DetailPage;
