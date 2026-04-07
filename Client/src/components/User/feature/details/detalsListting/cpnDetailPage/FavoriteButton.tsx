import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "@nextui-org/react";
import { AppDispatch, RootState } from "../../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatchlistThunk,
  CheckWatchlistThunk,
  deleteWatchlistThunk,
} from "../../../../../../redux/product/wathList/wathlist";
import NotFoundProduct from "../../../../../../error/404/NotFoundProduct";
import { getProfileThunk } from "../../../../../../redux/auth/authThunk";
// import { toast } from "react-toastify";

interface FavoriteButtonProps {
  onClick?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { productDetail } = useSelector(
    (state: RootState) => state.productClient.getProductDetail
  );
  const watchlist =
    useSelector((state: RootState) => state.watchlist.items) || [];

  const firstVariant = productDetail?.variants?.length
    ? productDetail.variants[0]
    : null;

  if (!productDetail || productDetail.variants?.length === 0) {
    return <NotFoundProduct />;
  }

  const isFavorite =
    Array.isArray(watchlist) &&
    watchlist.some((item) => {
      const productVariant = Array.isArray(item?.productVariant)
        ? item?.productVariant[0]
        : item?.productVariant;

      return productVariant?._id === firstVariant?._id;
    });

  useEffect(() => {
    dispatch(getProfileThunk());
    fetchWatchlist();
  }, [dispatch]);

  const fetchWatchlist = async () => {
    try {
      await dispatch(CheckWatchlistThunk());
    } catch (error) {
      console.error("Không thể lấy danh sách yêu thích:", error);
    }
  };

  const handleAddToWatchlist = async () => {
    if (loading) return;

    const variantId = firstVariant?._id;

    if (!variantId) {
      setError("Thiếu thông tin biến thể.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isFavorite) {
        await dispatch(deleteWatchlistThunk({ variantId })).unwrap();
        dispatch(fetchWatchlist);
        // toast.dismiss();
        // const successMessage = response?.message || "Xóa yêu thích thành công!";
        // toast.success(successMessage);
      } else {
        await dispatch(addToWatchlistThunk({ variantId })).unwrap();
        dispatch(fetchWatchlist);
        // toast.dismiss();
        // const successMessage =
        //   response?.message || "Đã thêm vào danh sách yêu thích!";
        // toast.success(successMessage);
      }
    } catch (error) {
      // const errorMessage = (error as Error).message || "Lỗi xảy ra.";
      // toast.dismiss();
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Tooltip content="Thêm vào danh sách yêu thích" placement="top">
        <motion.a
          href="#"
          className={`flex items-center justify-center py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-sky-700 rounded-lg border border-gray-200 ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
          role="button"
          onClick={handleAddToWatchlist}
          whileHover={{ opacity: loading ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <i
            className={`iconify mdi--heart w-5 h-5 transition duration-75 ${
              isFavorite ? "text-red-600" : "text-white"
            }`}
          ></i>
          {loading ? "Đang xử lý..." : "Yêu thích"}
        </motion.a>
      </Tooltip>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FavoriteButton;
