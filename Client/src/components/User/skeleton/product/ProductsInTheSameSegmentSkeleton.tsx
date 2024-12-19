import React from "react";
import { Skeleton } from "@nextui-org/react";

interface ProductsInTheSameSegmentSkeletonProps {
  length?: number;
}

const ProductsInTheSameSegmentSkeleton: React.FC<ProductsInTheSameSegmentSkeletonProps> = ({ length = 8 }) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl">
      {[...Array(length)].map((_, index) => (
        <div
          key={index}
          className="flex items-center px-2 sm:px-4 md:px-8 py-4 bg-white border border-gray-100 rounded-lg shadow-sm gap-4"
        >
          {/* Skeleton for product image */}
          <Skeleton className="w-24 h-24 rounded-lg">
            <div className="h-full w-full bg-gray-200" />
          </Skeleton>
          <div className="flex flex-col justify-center flex-grow">
            {/* Skeleton for product name */}
            <Skeleton className="w-3/4 h-5 mb-2 rounded-lg">
              <div className="h-5 bg-gray-300" />
            </Skeleton>
            {/* Skeleton for price */}
            <Skeleton className="w-1/2 h-4 rounded-lg">
              <div className="h-4 bg-gray-300" />
            </Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsInTheSameSegmentSkeleton;
