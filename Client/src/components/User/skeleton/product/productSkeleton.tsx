import React from "react";
import Skeleton from "@mui/material/Skeleton";
import styles from "../../feature/listPage/css/section.module.css";
interface ProductSkeletonListProps {
  length?: number;
}

const ProductSkeletonList: React.FC<ProductSkeletonListProps> = ({ length = 12 }) => {
  return (
    <div className="bg-white">
          <section className={styles.sectionContainer}>
            <div className={styles.container}>
              <div className={styles.gridContainer}>
          {[...Array(length)].map((_, index) => (
            <div
              key={index}
              className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
            >
              <Skeleton variant="rectangular" width="100%" height={200} />
              <div className="p-2">
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
                <div className="mt-2">
                  <Skeleton variant="text" width="50%" height={30} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </section>
    </div>
  );
};

export default ProductSkeletonList;
