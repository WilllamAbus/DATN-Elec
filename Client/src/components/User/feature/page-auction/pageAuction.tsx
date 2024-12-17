
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FunnelIcon } from "@heroicons/react/20/solid";
import { breadcrumbItemClient, ReusableBreadcrumbClient } from "../../../../ultils/breadcrumb/admin";
import ProductFilters from "./prouctAuctionFilter";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import {
  listPageAuctionProductThunk,
  getAllBrandPageAuctionThunk,
  getAllConditionShoppingThunk
} from "../../../../redux/product/client/Thunk";
import ProductAuctionSkeleton from "../../skeleton/product/productAuctionSkeleton";
import ProductList from "./productList";
import styles from "./css/section.module.css";
import ProductAuctionSort from "./productAuctionSort";
import FilterViewer from "./filterAuction/filterViewer";
import { FilterState, QueryParamAuction } from "../../../../services/product_v2/client/types/listPageAuction";
import NoProductsMessage from "./noProduct";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import useAuctionFilters from "./useAuctionFiltersHook";
import { Pagination } from "@nextui-org/react";
export default function AuctionSidebar() {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const queryParams = queryString.parse(location.search) as QueryParamAuction;
  const currentPage = useSelector(
    (state: RootState) => state.productClient.listPageAuctionProduct.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.productClient.listPageAuctionProduct.pagination?.totalPages || 1
  );
  const total = useSelector(
    (state: RootState) => state.productClient.listPageAuctionProduct.total || 0
  );
  const products = useSelector(
    (state: RootState) => state.productClient.listPageAuctionProduct.products || []
  );
  const isLoading = useSelector(
    (state: RootState) => state.productClient.listPageAuctionProduct.isLoading
  );
  const brands = useSelector((state: RootState) => state.productClient.getAllBrandPageAuction.brands || []);
  const conditions = useSelector((state: RootState) => state.productClient.getAllConditionShoppingPageAuction.conditionShopping || []);
  useEffect(() => {
    dispatch(getAllBrandPageAuctionThunk());
    dispatch(getAllConditionShoppingThunk());
  }, [dispatch]);
  const [filters, setFilters] = useAuctionFilters(queryParams, brands, conditions);
  const noProducts = !isLoading && products.length === 0;
  useEffect(() => {
    dispatch(listPageAuctionProductThunk({
      page: filters.page,
      limit: filters.limit,
      _sort: filters._sort,
      brand: filters.brand || [],
      conditionShopping: filters.conditionShopping || [],
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minDiscountPercent: filters.minDiscountPercent,
      maxDiscountPercent: filters.maxDiscountPercent,
    }));
  }, [dispatch, filters]);
  const handlePageChange = (page: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
    }));
  };
  const handleSortChange = (newSortValue: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      _sort: newSortValue,
    }));
  };
  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
      }));
    },
    []
  );
  const setNewFilter = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
    },
    []
  );
  const hasFilters = Object.keys(filters).some((key) => {
    const value = filters[key];
    if (key === '_sort' && (value === 'product_price:ASC' || value === 'product_price:DESC')) return false;
    if (key === 'page' && value === 1) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (value === undefined || value === null || value === '') return false;
    return true;
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  return (
    <div>
      <ReusableBreadcrumbClient items={breadcrumbItemClient.auction} />
      <div className="w-full max-w-screen-2xl px-0 bg-white">
        <div>
          <Dialog
            open={mobileFiltersOpen}
            onClose={setMobileFiltersOpen}
            className="relative z-40 lg:hidden"
          >
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 z-40 flex">
              <DialogPanel
                transition
                className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
              >
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
                <form className="mt-4 border-t border-gray-200">
                  <h3 className="sr-only">Categories</h3>
                  <ProductFilters filters={filters} onChange={handleFilterChange} />
                </form>
              </DialogPanel>
            </div>
          </Dialog>
          <main className="w-full max-w-screen-2xl px-0 sm:px-6 lg:px-5">
            <section aria-labelledby="products-heading" className="pb-24 pt-4">
              <h2 id="products-heading" className="sr-only">
                sản phẩm
              </h2>
              <div className="grid grid-cols-1 gap-x-0.5 gap-y-10 lg:grid-cols-4">
                <div className="lg:col-span-1">
                  {" "}
                  <form className="hidden lg:block rounded-lg border border-gray-100 bg-white shadow-sm ">
                    <h3 className="sr-only">Categories</h3>
                    <ProductFilters filters={filters} onChange={handleFilterChange} />
                  </form>{" "}
                </div>
                <div className="lg:col-span-3">
                  <div className="bg-white shadow-md sm:rounded-t-lg  overflow-hidden border border-gray-100 antialiased dark:bg-gray-900 md:py-4">
                    <div className="flex items-center justify-between px-4 py-2">
                      <h1 className="text-xl font-barlow font-bold text-gray-900">
                        Sản phẩm - Đấu giá
                        <span className="text-lg font-medium text-gray-500"> (có {total} sản phẩm)</span>
                      </h1>
                      <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(true)}
                        className="ml-4 p-2 text-gray-400 hover:text-gray-500 lg:hidden"
                      >
                        <span className="sr-only">Filters</span>
                        <FunnelIcon aria-hidden="true" className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  {hasFilters && (
                    <div className="bg-white shadow-md overflow-hidden border border-gray-100 antialiased dark:bg-gray-900 md:py-4">
                      <div className="flex items-center px-4 py-2">
                        <h1 className="text-lg font-barlow font-medium text-gray-900">
                          Bộ lọc hiện tại
                        </h1>
                        <FilterViewer filters={filters} onChange={setNewFilter} />
                      </div>
                    </div>
                  )}
                  <div className="bg-white">
                    <section className={styles.sectionContainer}>
                      <ProductAuctionSort currentSort={filters._sort} onChange={handleSortChange} />
                      <div className={styles.container}>
                        {isLoading ? (
                          <ProductAuctionSkeleton length={total || 12} />
                        ) : noProducts ? (
                          <NoProductsMessage />
                        ) : (
                          <ProductList products={products} />
                        )}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex justify-center my-4">
                          <Pagination
                            isCompact
                            loop
                            showControls
                            color="primary"
                            total={totalPages}
                            initialPage={currentPage}
                            onChange={(page) => handlePageChange(page)}
                          />
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
