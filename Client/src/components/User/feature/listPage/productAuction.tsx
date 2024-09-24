// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import { listPageAuctionProductThunk } from "../../../../redux/product/client/Thunk";
// import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
// import ProductSkeletonList from "../../skeleton/product/productSkeleton";
// import ProductList from "./productList";
// import styles from "./css/section.module.css";
// import ProductAuctionSort from "./productAuctionSort";
// import FilterByBrand from "./filterAuction/filterbybrand";

// export default function ListPage() {
//   const dispatch: AppDispatch = useDispatch();

//   const [filters, setFilters] = useState<{
//     _sort: string;
//     brand?: string; 
//   }>({
//     _sort: "product_price:ASC",
//     brand: undefined
//   });
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
//     dispatch(listPageAuctionProductThunk({ page: currentPage, _sort: filters._sort, brand: filters.brand }));
//   }, [dispatch, currentPage, filters._sort, filters.brand]);

//   const handlePageChange = (page: number) => {
//     dispatch(listPageAuctionProductThunk({ page, _sort: filters._sort, brand: filters.brand }));
//   };

//   const handleSortChange = (newSortValue: string) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       _sort: newSortValue,
//     }));
//   };

//   const handleBrandChange = (newBrandId: string) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       brand: newBrandId
//     }));
//   };
  

//   return (
//     <div className="bg-white">
//       <section className={styles.sectionContainer}>
//         <ProductAuctionSort currentSort={filters._sort} onChange={handleSortChange} />
//         <FilterByBrand onchange={handleBrandChange} /> 
//         <div className={styles.container}>
//           {isLoading ? <ProductSkeletonList length={6} /> : <ProductList products={products} />}
//         </div>
//         <PaginationComponent
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       </section>
//     </div>
//   );
// }
