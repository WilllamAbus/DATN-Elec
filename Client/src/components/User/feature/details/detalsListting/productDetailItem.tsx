import VariantName from "./cpnDetailPage/VariantName";
import VariantPrice from "./cpnDetailPage/VariantPrice";
import FavoriteButton from "./cpnDetailPage/FavoriteButton";
import AddToCartButton from "./cpnDetailPage/AddToCartButton";

import StorageSelector from "./filter/StorageSelector";
import { Star } from "./svg";
import {
  GetDetailProductResponse,
  FilterState,
} from "../../../../../services/detailProduct/types/getDetailProduct";
import { useState } from "react";
const ProductDetailLayout = ({
  productDetail,
}: {
  productDetail: GetDetailProductResponse["data"];
}) => {
  const firstVariant = productDetail?.variants?.length
    ? productDetail.variants[0]
    : null;
  const [filters] = useState<FilterState>({});
  return (
    <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
        <div className="mt-6 sm:mt-8 lg:mt-0">
          {firstVariant && (
            <VariantName variant={firstVariant} product={productDetail} />
          )}
          <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
            {firstVariant && (
              <VariantPrice variant={firstVariant} product={productDetail} />
            )}
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <div className="flex items-center gap-1">
                <Star />
              </div>
              <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                {productDetail.product_ratingAvg}
              </p>
              <a
                href="#"
                className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
              >
                {productDetail.product_view} Lượt xem
              </a>
            </div>
          </div>
          <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
            <FavoriteButton />
            {/* <AddToCartButton /> */}
            <AddToCartButton productId={productDetail?._id} />
          </div>
          <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
          <div className="grid grid-cols-2 gap-6 mt-6">
            <StorageSelector filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailLayout;
