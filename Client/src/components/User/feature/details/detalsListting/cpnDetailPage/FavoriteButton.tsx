import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "@nextui-org/react";
import { AppDispatch, RootState } from "../../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { WatchlistItem } from "../../../../../../types/cart/profile/wathlist";
import {
  addToWatchlistThunk,
  deleteWatchlistThunk,
  getWatchlistThunk,
} from "../../../../../../redux/product/wathList/wathlist";
import NotFoundProduct from "../../../../../../error/404/NotFoundProduct";
import { getProfileThunk } from "../../../../../../redux/auth/authThunk";
import { toast } from "react-toastify";

interface FavoriteButtonProps {
  onClick?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { productDetail } = useSelector(
    (state: RootState) => state.productClient.getProductDetail
  );

  const firstVariant = productDetail?.variants?.length
    ? productDetail.variants[0]
    : null;

  if (!productDetail || productDetail.variants?.length === 0) {
    return <NotFoundProduct />;
  }

  const fetchWatchlist = async () => {
    try {
      const watchlistResponse = await dispatch(getWatchlistThunk()).unwrap();
      if (Array.isArray(watchlistResponse)) {
        const isFavoriteProduct = watchlistResponse.some(
          (item: WatchlistItem) => item?.product?._id === productDetail._id
        );
        setIsFavorite(isFavoriteProduct);
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Không thể lấy danh sách yêu thích:", error);
    }
  };

  useEffect(() => {
    fetchWatchlist();
    dispatch(getProfileThunk());
  }, [dispatch]);

  const handleAddToWatchlist = async () => {
    if (loading) return; // Ngăn spam khi đang xử lý

    const variantId = firstVariant?._id;
    const productId = productDetail?._id;

    if (!variantId || !productId) {
      setError("Thiếu thông tin sản phẩm hoặc biến thể.");
      return;
    }

    setLoading(true); // Bắt đầu xử lý, khóa nút
    setError(null);

    try {
      if (isFavorite) {
        const response = await dispatch(
          deleteWatchlistThunk({ productId, variantId })
        ).unwrap();
        dispatch(getWatchlistThunk());
        setIsFavorite(false);
        toast.dismiss();
        const successMessage = response?.message || "Xóa yêu thích thành công!";
        toast.success(successMessage);
      } else {
        const response = await dispatch(
          addToWatchlistThunk({ productId, variantId })
        ).unwrap();
        dispatch(getWatchlistThunk());
        setIsFavorite(true);
        toast.dismiss();
        const successMessage =
          response?.message || "Đã thêm vào danh sách yêu thích!";
        toast.success(successMessage);
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "Lỗi xự cố.";
      toast.dismiss();
      toast.error(errorMessage);
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
