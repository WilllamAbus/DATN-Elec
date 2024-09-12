// import { useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import { listPageAuctionProductThunk } from "../../../../redux/product/client/Thunk";
// import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
// import currencyFormatter from "currency-formatter";
// import { truncateText } from "../listPage/truncate/truncateText";
// import ProductSkeletonList from "../../skeleton/product/productSkeleton";
// import styles from "/css/section.module.css";
// import { HeartIcon, StarIcon } from "../listPage/svg";
// import Top from "../listPage/filter/top";

// function formatCurrency(value: number) {
//   return currencyFormatter.format(value, { code: "VND", symbol: "" });
// }
// export default function ListPage() {
//   const dispatch: AppDispatch = useDispatch();

//   const currentPage = useSelector(
//     (state: RootState) => state.productClient.listPageAuctionProduct.pagination?.currentPage || 1
//   );
//   const totalPages = useSelector(
//     (state: RootState) => state.productClient.listPageAuctionProduct.pagination?.totalPages || 1
//   );
//   const products = useSelector(
//     (state: RootState) => state.productClient.listPageAuctionProduct.products || []
//   );
//   const isLoading = useSelector(
//     (state: RootState) => state.productClient.listPageAuctionProduct.isLoading
//   );
//   useEffect(() => {
//     dispatch(listPageAuctionProductThunk({ page: currentPage }));
//   }, [dispatch, currentPage]);

//   const handlePageChange = (page: number) => {
//     dispatch(listPageAuctionProductThunk({ page }));
//   };

//   return (
//     <div className="bg-white">
//       <Top />
//       {isLoading ? (
//         <ProductSkeletonList length={12} />
//       ) : (
//         <section className={styles.sectionContainer}>
//           <div className={styles.container}>
//             <div className={styles.gridContainer}>
//               {products.map((product, index) => (
//                 <div
//                   key={index}
//                   className="relative w-full flex-col overflow-hidden rounded-s-sm border border-gray-100 bg-white shadow-md"
//                 >
//                   <div className="backdrop-blur-sm bg-white/30">
//                     <Link to={`/detailProd/${product._id}`}>
//                       <figure className="relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale-0">
//                         <img
//                           className="rounded-lg"
//                           src={product.image[0]}
//                           alt={`product ${index + 1}`}
//                         />
//                       </figure>
//                     </Link>
//                   </div>

//                   <div className="pt-1 mb-10">
//                     <div className="mb-4 px-2 flex items-center justify-between gap-4">
//                       {product.product_discount.discountPercent > 0 ? (
//                         <span className=" rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
//                           Giảm giá {product.product_discount.discountPercent}%
//                         </span>
//                       ) : (
//                         <span className="me-2 rounded px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"></span>
//                       )}
//                       <div className="flex items-center justify-end gap-1">
//                         <button
//                           type="button"
//                           data-tooltip-target="tooltip-add-to-favorites"
//                           className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//                         >
//                           <HeartIcon fill="red" size="1em" />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white">
//                       <div className="mt-1 px-2 pb-1">
//                         <a href="#">
//                           <h5 className="text-sm tracking-tight text-slate-900 font-medium">
//                             {truncateText(product.product_name, 30)}
//                           </h5>
//                         </a>
//                       </div>
//                     </div>

//                     <div className="px-2 flex items-center gap-2">
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         {product.product_ratingAvg ? product.product_ratingAvg.toFixed(1) : "N/A"}
//                       </p>
//                       <StarIcon />
//                       <div className="text-xs text-gray-500 items-center">
//                         {product.product_quantity > 0
//                           ? `(Còn ${product.product_quantity} sản phẩm)`
//                           : "Hết hàng"}
//                       </div>
//                     </div>
//                     <div className="mt-2 px-2 flex items-center gap-2">
//                       {product.product_discount.discountPercent > 1 ? (
//                         <div className="flex w-full">
//                           <p className="text-xs font-medium text-rose-700 flex-grow">
//                             {formatCurrency(
//                               product.product_price *
//                                 (1 - product.product_discount.discountPercent / 100)
//                             )}{" "}
//                             đ
//                           </p>
//                           <p className="text-xs font-medium text-gray-400 line-through flex-shrink-0">
//                             {formatCurrency(product.product_price)} đ
//                           </p>
//                         </div>
//                       ) : (
//                         <p className="text-xs font-medium text-rose-700">
//                           {formatCurrency(product.product_price)} đ
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}
//       <PaginationComponent
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// }
