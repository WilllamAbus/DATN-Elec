// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import {
//   deleteWatchlistThunk,
//   getWatchlistThunk,
// } from "../../../../redux/product/wathList/wathlist";
// import { AppDispatch } from "../../../../redux/store";
// import { Link } from "react-router-dom";
// import { HeartIcon, StarIcon } from "../listPage/svg";

// import { UserProfile } from "../../../../types/user";
// import currencyFormatter from "currency-formatter";
// import { truncateText } from "../listPage/truncate/truncateText";
// interface WatchlistProps {
//   profiles?: UserProfile | null;
// }
// function formatCurrency(value: number) {
//   return currencyFormatter.format(value, { code: "VND", symbol: "" });
// }

// const Watchlist: React.FC<WatchlistProps> = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   // const userId = useSelector(
//   //   (state: RootState) => state.auth.profile.profile?._id
//   // );
//   const [watchlist, setWatchlist] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchWatchlist = async () => {
//       try {
//         const watchlistResponse = await dispatch(getWatchlistThunk()).unwrap();
//         setWatchlist(watchlistResponse);
//       } catch (error) {
//         setError("Không có yêu thích");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWatchlist();
//   }, [dispatch]);

//   const handleDeleteFromWatchlist = async (variantId: string) => {
//     try {
//       await dispatch(deleteWatchlistThunk({ variantId })).unwrap();
//       setWatchlist(
//         watchlist.filter(
//           (item) => item.productVariant && item.productVariant._id !== variantId
//         )
//       );
//       toast.success("Sản phẩm đã bị xóa khỏi danh sách yêu thích.");
//     } catch (error) {
//       console.error("Error deleting item from watchlist:", error);
//       toast.error("Đã xảy ra sự cố khi xóa sản phẩm khỏi danh sách yêu thích.");
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;
//   if (!Array.isArray(watchlist) || watchlist.length === 0) {
//     return <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>;
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Danh sách yêu thích</h1>
//       <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
//         {watchlist.map((item, index) => {
//           const product = item.product;
//           const variant = item.productVariant;
//           if (!product) return null;

//           return (
//             <div
//               key={index}
//               className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
//             >
//               <div className="backdrop-blur-sm bg-white/30">
//                 <Link to={`/product/${product.slug}`}>
//                   <figure className="relative w-full h-0 pb-[100%] overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0">
//                     <img
//                       className="absolute inset-0 w-full h-full object-cover rounded-lg p-4"
//                       src={product.image[0]}
//                       alt={product.product_name}
//                     />
//                   </figure>
//                 </Link>
//               </div>
//               <div className="p-2">
//                 <div className="mb-2 flex justify-between">
//                   {/* {product.product_discount.discountPercent > 0 ? (
//                     <span className="rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
//                       Giảm giá {product.product_discount.discountPercent}%
//                     </span>
//                   ) : (
//                     <span className="me-2 rounded px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"></span>
//                   )} */}
//                   <div className="flex items-center justify-end gap-1">
//                     <button
//                       onClick={() => handleDeleteFromWatchlist(variant._id)}
//                       type="button"
//                       className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//                     >
//                       <HeartIcon fill="red" size="1em" />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white">
//                   <div className="mt-1 px-2 pb-1">
//                     <a href="#">
//                       <h5 className="text-sm tracking-tight text-slate-900 font-medium">
//                         {truncateText(product.product_name, 20)}{" "}
//                         {/* Giảm độ dài hiển thị tên sản phẩm */}
//                       </h5>
//                     </a>
//                   </div>
//                 </div>
//                 {/* Hiển thị bộ nhớ và RAM */}
//                 <div className="px-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
//                   {variant?.storage.name || "N/A"} |{" "}
//                   {variant?.ram.name || "N/A"}
//                 </div>
//                 <div className="px-2 flex items-center gap-2">
//                   <p className="text-sm font-medium text-gray-900 dark:text-white">
//                     {product.product_ratingAvg
//                       ? product.product_ratingAvg.toFixed(1)
//                       : "N/A"}
//                   </p>
//                   <StarIcon />
//                   <div className="text-xs text-gray-500 items-center">
//                     {product.product_quantity > 0
//                       ? `(Còn ${product.product_quantity} sản phẩm)`
//                       : "Hết hàng"}
//                   </div>
//                 </div>
//                 <div className="mt-2 px-2 flex items-center gap-2">
//                   {/* {product.product_discount.discountPercent > 1 ? (
//                     <div className="flex w-full">
//                       <p className="text-xs font-medium text-rose-700 flex-grow">
//                         {formatCurrency(
//                           product.product_price *
//                             (1 - product.product_discount.discountPercent / 100)
//                         )}{" "}
//                         đ
//                       </p>
//                       <p className="text-xs font-medium text-gray-400 line-through flex-shrink-0">
//                         {formatCurrency(product.product_price)} đ
//                       </p>
//                     </div>
//                   ) : (
//                     <p className="text-xs font-medium text-rose-700">
//                       {formatCurrency(product.product_price)} đ
//                     </p>
//                   )} */}
//                   <p className="text-xs font-medium text-rose-700">
//                     {formatCurrency(variant.variant_price)} đ
//                   </p>
//                 </div>
//               </div>
//               {/* <div className="flex justify-center pt-4 py-2 mb-2">
//                 <Button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out">
//                   Thêm vào giỏ hàng
//                 </Button>
//               </div> */}
//             </div>
//           );
//         })}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Watchlist;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  deleteWatchlistThunk,
  getWatchlistThunk,
} from "../../../../redux/product/wathList/wathlist";
import { AppDispatch, RootState } from "../../../../redux/store";
import { Link } from "react-router-dom";
import { HeartIcon, StarIcon } from "../listPage/svg";

import { UserProfile } from "../../../../types/user";

import { truncateText } from "../listPage/truncate/truncateText";
import { Pagination } from "@nextui-org/react";

interface WatchlistProps {
  profiles?: UserProfile | null;
}

// const Watchlist: React.FC<WatchlistProps> = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const currentPage = useSelector(
//     (state: RootState) => state.watchlist.pagination?.currentPage || 1
//   );
//   const [searchTerm] = useState<string>("");
//   const totalPages = useSelector(
//     (state: RootState) => state.watchlist.pagination?.totalPages || 1
//   );

//   const watchlist = useSelector(
//     (state: RootState) => state.watchlist.items || []
//   );
//   console.log(watchlist);

//   useEffect(() => {
//     dispatch(
//       getWatchlistThunk({
//         page: currentPage,
//         search: searchTerm,
//       })
//     );
//   }, [dispatch, currentPage, searchTerm]);
//   const handlePageChange = (page: number) => {
//     dispatch(
//       getWatchlistThunk({
//         page,
//         search: searchTerm,
//       })
//     );
//   };
//   const handleDeleteFromWatchlist = async (variantId: string) => {
//     try {
//       await dispatch(deleteWatchlistThunk({ variantId })).unwrap();
//       dispatch(
//         getWatchlistThunk({
//           page: currentPage,
//           search: searchTerm,
//         })
//       );

//       toast.success("Sản phẩm đã bị xóa khỏi danh sách yêu thích.");
//     } catch (error) {
//       console.error("Error deleting item from watchlist:", error);
//       toast.error("Đã xảy ra sự cố khi xóa sản phẩm khỏi danh sách yêu thích.");
//     }
//   };
const Watchlist: React.FC<WatchlistProps> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const currentPage = useSelector(
    (state: RootState) => state.watchlist.pagination?.currentPage || 1
  );
  const [searchTerm] = useState<string>("");
  const totalPages = useSelector(
    (state: RootState) => state.watchlist.pagination?.totalPages || 1
  );

  const watchlist = useSelector(
    (state: RootState) => state.watchlist.items || []
  );
  console.log(watchlist);

  useEffect(() => {
    dispatch(
      getWatchlistThunk({
        page: currentPage,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(
      getWatchlistThunk({
        page,
        search: searchTerm,
      })
    );
  };

  const handleDeleteFromWatchlist = async (variantId: string) => {
    try {
      await dispatch(deleteWatchlistThunk({ variantId })).unwrap();

      if (watchlist.length === 1 && currentPage > 1) {
        handlePageChange(1);
      } else {
        dispatch(
          getWatchlistThunk({
            page: currentPage,
            search: searchTerm,
          })
        );
      }

      toast.success("Sản phẩm đã bị xóa khỏi danh sách yêu thích.");
    } catch (error) {
      console.error("Error deleting item from watchlist:", error);
      toast.error("Đã xảy ra sự cố khi xóa sản phẩm khỏi danh sách yêu thích.");
    }
  };
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Danh sách yêu thích
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {watchlist.map((item, index) => {
          const product = item.product;
          const variant = Array.isArray(item.productVariant)
            ? item.productVariant
            : [item.productVariant];

          if (!product) return null;

          return (
            <div
              key={index}
              className="relative rounded-lg border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Link to={`/product/${product.slug}`}>
                  <figure className="w-full h-56 bg-gray-100 flex items-center justify-center">
                    <img
                      className="object-contain w-[85%] h-[85%]"
                      src={product.image[0]}
                      alt={product.product_name}
                    />
                  </figure>
                </Link>
                <button
                  onClick={() => handleDeleteFromWatchlist(variant[0]._id)}
                  className="absolute top-3 right-3 rounded-full p-2 bg-white shadow-md hover:bg-gray-100"
                >
                  <HeartIcon fill="red" size="1.5em" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/product/${product.slug}`}>
                  <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">
                    {truncateText(product.product_name, 15)}
                  </h2>
                </Link>
                <div className="text-sm text-gray-600 mt-1">
                  {variant?.[0]?.storage?.name || ""} |{" "}
                  {variant?.[0]?.ram?.name || ""}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <p>
                    {product.product_ratingAvg
                      ? product.product_ratingAvg.toFixed(1)
                      : "N/A"}
                  </p>
                  <StarIcon />
                  {/* <span className="ml-2">
                    {product.product_quantity > 0
                      ? `(Còn ${product.product_quantity} sản phẩm)`
                      : "Hết hàng"}
                  </span> */}
                </div>
                <div className="mt-3">
                  <p className="text-lg font-bold text-rose-600">
                    {variant[0].variant_price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ToastContainer />
      <div className="flex justify-center my-4">
        <Pagination
          isCompact
          loop
          showControls
          color="primary"
          total={totalPages}
          page={currentPage}
          initialPage={1}
          onChange={(page) => handlePageChange(page)}
        />
      </div>
    </div>
  );
};

export default Watchlist;
