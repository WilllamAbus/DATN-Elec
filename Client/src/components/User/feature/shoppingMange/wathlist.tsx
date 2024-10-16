import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteWatchlistThunk,
  getWatchlistThunk,
} from "../../../../redux/product/wathList/wathlist";
import { AppDispatch, RootState } from "../../../../redux/store";
import "../../../../assets/css/admin.style.css";
import { UserProfile } from "../../../../types/user";
interface WatchlistProps {
  profiles?: UserProfile | null;
}
const Watchlist: React.FC<WatchlistProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(
    (state: RootState) => state.auth.profile.profile?._id
  );
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const watchlistResponse = await dispatch(getWatchlistThunk()).unwrap();
        setWatchlist(watchlistResponse);
      } catch (error) {
        setError("Không có yêu thích");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchWatchlist();
    }
  }, [dispatch, userId]);

  const handleDeleteFromWatchlist = async (productId: string) => {
    try {
      await dispatch(deleteWatchlistThunk(productId)).unwrap();
      setWatchlist(
        watchlist.filter(
          (item) => item.product && item.product._id !== productId
        )
      );
      toast.success("Sản phẩm đã bị xóa khỏi danh sách yêu thích.");
    } catch (error) {
      console.error("Error deleting item from watchlist:", error);
      toast.error("Đã xảy ra sự cố khi xóa sản phẩm khỏi danh sách yêu thích.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!Array.isArray(watchlist) || watchlist.length === 0) {
    return <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách yêu thích</h1>
      <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        {watchlist.map((item) => {
          const product = item.product;
          if (!product) return null;

          return (
            <li key={item._id} className="py-3 sm:py-4">
              <div className="flex items-center justify-between space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={product.image[0]}
                    alt={product.product_name}
                  />
                </div>
                <div className="flex-1 min-w-0 text-center">
                  <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                    {product.product_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {product.product_ratingAvg}
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {product.product_price_unit.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
                <button
                  className="ml-4 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-3 py-1 text-sm"
                  onClick={() => handleDeleteFromWatchlist(item.product._id)}
                >
                  Xóa
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default Watchlist;
