import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Star } from "./svg";
import VariantImageGallery from "./cpnDetailPage/VariantImageGallery";
import FavoriteButton from "./cpnDetailPage/FavoriteButton";
import AddToCartButton from "./cpnDetailPage/AddToCartButton";
import ColorSelector from "./cpnDetailPage/ColorSelector";
import VariantName from "./cpnDetailPage/VariantName";
import VariantPrice from "./cpnDetailPage/VariantPrice";
import { FilterState, QueryParamAuction } from "../../../../../services/detailProduct/types/getDetailProduct";
import DetailFilters from "./detaiFilter";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { getProductDetailThunk } from "../../../../../redux/product/client/Thunk";

const DetailPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = queryString.parse(location.search);

  const { productDetail } = useSelector(
    (state: RootState) => state.productClient.getProductDetail
  );

  const [filters, setFilters] = useState<FilterState>({
    storage: queryParams.storage ? String(queryParams.storage) : "",
    color: queryParams.color ? String(queryParams.color) : "",
  });

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
        })
      );
    }
  }, [slug, dispatch, filters.storage, filters.color]);

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
      }));
    },
    []
  );

  const firstVariant = productDetail?.variants?.length ? productDetail.variants[0] : null;


  return (
    <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <VariantImageGallery
            variants={productDetail?.variants || []}
            product_name={productDetail?.product_name || ""}
          />
          <div className="mt-6 sm:mt-8 lg:mt-0">
            {firstVariant && (
              <>
                <VariantName variant={firstVariant} product={productDetail || {}} />

                <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                  <VariantPrice variant={firstVariant}product={productDetail || {}} />
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <div className="flex items-center gap-1">
                      <Star />
                    </div>
                    <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                      {productDetail?.product_ratingAvg}
                    </p>
                    <a
                      href="#"
                      className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                    >
                      {productDetail?.product_view} Lượt xem
                    </a>
                  </div>
                </div>
                <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                  <FavoriteButton />
                  <AddToCartButton />
                </div>
                <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <ColorSelector colors={firstVariant.color || []} />
                  <DetailFilters
                    filters={filters}
                    onChange={handleFilterChange}
                    variants={productDetail?.variants || []}
                  />

                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailPage;
