import ProductListPhone from "./productList/phone";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getPhoneByVariantsThunk } from "../../../../redux/product/client/Thunk";
import { useEffect } from "react";
import ProductSkeletonList from "../../skeleton/product/productHomeSkeleton";
import NoProductsMessage from "../listPage/noProduct";
import { Tooltip } from "@nextui-org/react";
import { MyButton } from "src/common/customs/MyButton";


export default function ListPhone() {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => {
    const phoneVariants = state.productClient.getPhoneByVariants.phoneVariants;
    return phoneVariants ? phoneVariants.variants : [];
  });
  const currentPage = useSelector(
    (state: RootState) => state.productClient.getPhoneByVariants.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.productClient.getPhoneByVariants.pagination?.totalPages || 1
  );
  const hasNextPage = useSelector(
    (state: RootState) => state.productClient.getPhoneByVariants.pagination?.hasNextPage || false
  );
  const hasPrevPage = useSelector(
    (state: RootState) => state.productClient.getPhoneByVariants.pagination?.hasPrevPage || false
  );
  const isLoading = useSelector(
    (state: RootState) => state.productClient.getPhoneByVariants.isLoading
  );

  useEffect(() => {
    dispatch(getPhoneByVariantsThunk({ page: 1 }));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(getPhoneByVariantsThunk({ page }));
  };

  const noProducts = products.length === 0;

  return (
    <div className="p-1 mb-4 m-4 bg-white border border-gray-100 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/icon%2Fdienthoai.svg?alt=media&token=0115fc9c-e628-4a41-88e7-4f8646f2fbc4"
              alt="Icon"
              className="w-10 h-10"
            />
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Điện thoại
            </h1>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between my-4">
            {hasPrevPage && (
              <Tooltip className="capitalize" color="primary" content="Trở lại" showArrow={true}>
                <MyButton
                  variant="flat"
                  size="sm"
                  onPress={() => handlePageChange(currentPage - 1)}
                  className="text-primary-500 bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black ml-2"
                >
                  <span>Trở lại</span>
                </MyButton>
              </Tooltip>
            )}
            {hasNextPage && (
              <Tooltip className="capitalize" color="primary" content="Xem tiếp" showArrow={true}>
                <MyButton
                  size="sm"
                  variant="flat"
                  onPress={() => handlePageChange(currentPage + 1)}
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
        <ProductSkeletonList length={8} />
      ) : noProducts ? (
        <NoProductsMessage />
      ) : (
        <ProductListPhone productVariant={products} />
      )}


    </div>
  );
}
