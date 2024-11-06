// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Tooltip } from "@nextui-org/react";
// import { Heart } from "../svg";
// import { AppDispatch, RootState } from "../../../../../../redux/store";
// import { useDispatch, useSelector } from "react-redux";
// import { WatchlistItem } from "../../../../../../types/cart/profile/wathlist";
// import {
//   addToWatchlistThunk,
//   deleteWatchlistThunk,
//   getWatchlistThunk,
// } from "../../../../../../redux/product/wathList/wathlist";
// import NotFoundProduct from "../../../../../../error/404/NotFoundProduct";
// import { getProfileThunk } from "../../../../../../redux/auth/authThunk";

// interface FavoriteButtonProps {
//   onClick?: () => void;
// }
// const FavoriteButton: React.FC<FavoriteButtonProps> = ({}) => {
//   const [isFavorite, setIsFavorite] = useState<boolean>(false);
//   const watchlistItems = useSelector((state: RootState) => state.watchlist);
//   const [error, setError] = useState<string | null>(null);
//   const dispatch: AppDispatch = useDispatch();
//   const { productDetail } = useSelector(
//     (state: RootState) => state.productClient.getProductDetail
//   );
//   const firstVariant = productDetail?.variants?.length
//     ? productDetail.variants[0]
//     : null;
//   if (!productDetail || productDetail.variants?.length === 0) {
//     return <NotFoundProduct />;
//   }
//   const fetchWatchlist = async () => {
//     try {
//       const watchlistResponse = await dispatch(getWatchlistThunk()).unwrap();

//       if (Array.isArray(watchlistResponse)) {
//         const isFavoriteProduct = watchlistResponse.some(
//           (item: WatchlistItem) => item?.product?._id === productDetail._id
//         );
//         setIsFavorite(isFavoriteProduct);
//         console.log(
//           "Sản phẩm có trong danh sách yêu thích:",
//           isFavoriteProduct
//         );
//       } else {
//         console.error("Danh sách yêu thích không hợp lệ:", watchlistResponse);
//         setIsFavorite(false);
//       }
//     } catch (error) {
//       console.error("Không thể lấy danh sách yêu thích:", error);
//     }
//   };
//   useEffect(() => {
//     fetchWatchlist();
//     dispatch(getProfileThunk());
//   }, [dispatch]);
//   const handleAddToWatchlist = async () => {
//     const variantId = firstVariant?._id; // Lấy variantId từ variant đầu tiên
//     const productId = productDetail?._id;
//     if (variantId) {
//       try {
//         let resultAction;

//         // Kiểm tra trạng thái yêu thích (có thể bạn cần một biến để kiểm tra)
//         if (isFavorite) {
//           resultAction = await dispatch(
//             deleteWatchlistThunk(productId)
//           ).unwrap();
//           console.log("Delete result action:", resultAction);

//           if (
//             !resultAction ||
//             typeof resultAction !== "object" ||
//             !resultAction._id
//           ) {
//             setIsFavorite(false); // Cập nhật trạng thái khi xóa không thành công
//           } else {
//             setIsFavorite(false); // Đặt lại trạng thái yêu thích thành false
//           }
//         } else {
//           resultAction = await dispatch(
//             addToWatchlistThunk({
//               productId: productDetail._id, // Sử dụng productId của sản phẩm
//               variantId,
//             })
//           ).unwrap();
//           console.log("Add result action:", resultAction);

//           if (
//             !resultAction ||
//             typeof resultAction !== "object" ||
//             !resultAction._id
//           ) {
//             setError("Lỗi khi thêm vào danh sách theo dõi");
//             setIsFavorite(false); // Đặt lại trạng thái yêu thích nếu có lỗi
//           } else {
//             setIsFavorite(true); // Đặt trạng thái yêu thích thành true
//           }
//         }
//       } catch (err) {
//         if (err instanceof Error) {
//           console.error("Lỗi xử lý danh sách theo dõi:", err.message);
//           setError(err.message);
//         } else {
//           console.error("Đã xảy ra lỗi không xác định:", err);
//           setError("Đã xảy ra lỗi không xác định.");
//         }
//       }
//     } else {
//       console.log("Variant ID is missing");
//       setError("Variant ID is missing");
//     }
//   };
//   if (Array.isArray(watchlistItems)) {
//     const isFavoriteProduct = watchlistItems.some(
//       (item) => item.product && item.product._id === productDetail?._id
//     );
//     setIsFavorite(isFavoriteProduct);
//   }
//   return (
//     <div>
//       <Tooltip content="Thêm vào danh sách yêu thích" placement="top">
//         <motion.a
//           href="#"
//           className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-customPink rounded-lg border border-gray-200"
//           role="button"
//           onClick={handleAddToWatchlist}
//           whileHover={{ opacity: 0.8 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Heart />
//           Yêu thích
//         </motion.a>
//       </Tooltip>

//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default FavoriteButton;
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

interface FavoriteButtonProps {
  onClick?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const watchlistItems = useSelector((state: RootState) => state.watchlist);
  const [error, setError] = useState<string | null>(null);
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
    const variantId = firstVariant?._id;
    const productId = productDetail?._id;

    if (variantId) {
      try {
        if (isFavorite) {
          await dispatch(deleteWatchlistThunk(productId)).unwrap();
          setIsFavorite(false);
        } else {
          await dispatch(
            addToWatchlistThunk({ productId, variantId })
          ).unwrap();
          setIsFavorite(true);
        }
      } catch (err) {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } else {
      setError("Variant ID is missing");
    }
  };

  if (Array.isArray(watchlistItems)) {
    const isFavoriteProduct = watchlistItems.some(
      (item) => item.product && item.product._id === productDetail._id
    );
    setIsFavorite(isFavoriteProduct);
  }

  return (
    <div>
      <Tooltip content="Thêm vào danh sách yêu thích" placement="top">
        <motion.a
          href="#"
          className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-sky-700 rounded-lg border border-gray-200"
          role="button"
          onClick={handleAddToWatchlist}
          whileHover={{ opacity: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <i
            className={`iconify mdi--heart w-5 h-5 transition duration-75 ${
              isFavorite ? "text-red-600" : "text-white"
            }`}
          ></i>
          Yêu thích
        </motion.a>
      </Tooltip>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FavoriteButton;
