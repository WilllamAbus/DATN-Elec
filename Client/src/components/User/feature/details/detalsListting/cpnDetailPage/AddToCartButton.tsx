import React, { useEffect } from "react";
import { Cart } from "../svg";
import { motion } from "framer-motion";
import { Tooltip } from "@nextui-org/react";
import {
  addProductToCart,
  fetchCartList,
} from "../../../../../../redux/cart/cartThunk";
import { AppDispatch, RootState } from "../../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
interface AddToCartButtonProps {
  productId: string; // Thêm productId vào props
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({}) => {
  const dispatch: AppDispatch = useDispatch();
  const { productDetail } = useSelector(
    (state: RootState) => state.productClient.getProductDetail
  );

  const firstVariant = productDetail?.variants?.length
    ? productDetail.variants[0]
    : null;

  const handleAddToCart = async () => {
    const variantId = firstVariant?._id;
    const productId = productDetail?._id;

    if (variantId && productId) {
      try {
        const response = await dispatch(
          addProductToCart({ productId, quantity: 1, variantId })
        ).unwrap();
        toast.dismiss();
        const successMessage = response?.message || "thêm thành công!";
        toast.success(successMessage);

        dispatch(fetchCartList());
      } catch (error) {
        toast.dismiss();

        const errorMessage = (error as Error).message || "lỗi ";
        toast.error(errorMessage);
      }
    } else {
      console.error("Không tìm thấy biến thể sản phẩm hoặc ID sản phẩm.");
    }
  };

  useEffect(() => {
    if (!productDetail || productDetail.variants?.length === 0) {
      console.error("Không tìm thấy thông tin sản phẩm hoặc biến thể.");
    }
  }, [productDetail]);

  return (
    <Tooltip content="Thêm vào danh giỏ hàng của bạn" placement="top">
      <motion.a
        href="#"
        className="text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center"
        role="button"
        onClick={handleAddToCart}
        whileHover={{ opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <Cart />
        Thêm vào giỏ
      </motion.a>
    </Tooltip>
  );
};

export default AddToCartButton;
