
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getAccessoryByVariantsThunk } from "../../../../redux/product/client/Thunk";
import { useState, useEffect } from "react";
import ProductSkeletonList from "../../skeleton/product/productHomeSkeleton";
import NoProductsMessage from "../listPage/noProduct";
import { Tooltip } from "@nextui-org/react";
import { MyButton } from "src/common/customs/MyButton";
import { motion } from 'framer-motion';
import ProductListAccessory from "./productList/accessory";
export default function ListAccessory() {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => {
    const accessoryVariants = state.productClient.getAccessoryByVarians.accessoryVariants;
    return accessoryVariants ? accessoryVariants.variants  : [];
  });
  const currentPage = useSelector(
    (state: RootState) => state.productClient.getAccessoryByVarians.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.productClient.getAccessoryByVarians.pagination?.totalPages || 1
  );
  const hasNextPage = useSelector(
    (state: RootState) => state.productClient.getAccessoryByVarians.pagination?.hasNextPage || false
  );
  const hasPrevPage = useSelector(
    (state: RootState) => state.productClient.getAccessoryByVarians.pagination?.hasPrevPage || false
  );
  const isLoading = useSelector(
    (state: RootState) => state.productClient.getAccessoryByVarians.isLoading
  );

  const [action, setAction] = useState<"next" | "prev" | null>(null);

  useEffect(() => {
    dispatch(getAccessoryByVariantsThunk({ page: 1 }));
  }, [dispatch]);

  const handlePageChange = (page: number, actionType: "next" | "prev") => {
    setAction(actionType);
    dispatch(getAccessoryByVariantsThunk({ page }));
  };
  const noProducts = products.length === 0;
  return (
    <div className="p-1 mb-4 m-4 bg-white border border-gray-100 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center justify-between gap-2">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/icon%2FOrange%20White%20Modern%20Gradient%20%20IOS%20Icon%20(4).svg?alt=media&token=497f2982-abe3-4ae9-ab7d-5ca2edb36544"
              alt="Icon"
              className="w-10 h-10"
            />
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Linh kiện
            </h1>
          </motion.div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between my-4">
            {hasPrevPage && (
              <Tooltip
                className="capitalize"
                color="primary"
                content="Trở lại"
                showArrow={true}
              >
                <MyButton
                  variant="flat"
                  size="sm"
                  onPress={() => handlePageChange(currentPage - 1, "prev")}
                  className="text-primary-500 bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black ml-2"
                >
                  <span>Trở lại</span>
                </MyButton>
              </Tooltip>
            )}
            {hasNextPage && (
              <Tooltip
                className="capitalize"
                color="primary"
                content="Xem tiếp"
                showArrow={true}
              >
                <MyButton
                  size="sm"
                  variant="flat"
                  onPress={() => handlePageChange(currentPage + 1, "next")}
                  className="text-primary-500 bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black ml-2"
                >
                  <span>Xem tiếp</span>
                </MyButton>
              </Tooltip>
            )}
          </div>
        )}
      </div>
      {isLoading ? (
        <ProductSkeletonList length={10} />
      ) : noProducts ? (
        <NoProductsMessage />
      ) : (
        <>
          {action === "next" || action === "prev" ? (
            <motion.div
              initial={{ opacity: 0, x: action === "next" ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: action === "next" ? 100 : -100 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <ProductListAccessory productVariant={products} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <ProductListAccessory productVariant={products} />
            </motion.div>
          )}
        </>
      )}


    </div>
  );
}

