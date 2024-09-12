import { useEffect } from "react";
import { breadcrumbItemClient, ReusableBreadcrumbClient } from "../../../../ultils/breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getProductsByCategoryThunk } from "../../../../redux/product/client/Thunk";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import currencyFormatter from "currency-formatter";
import { truncateText } from "./truncate/truncateText";
import ProductSkeletonList from "../../skeleton/product/productSkeleton";
import styles from "./css/section.module.css";
import { useParams } from "react-router-dom";

function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}

export default function ListPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  console.log("Category ID from useParams:", categoryId);
  const dispatch: AppDispatch = useDispatch();
  
  const currentPage = useSelector(
    (state: RootState) => state.productClient.getProductsByCategory.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.productClient.getProductsByCategory.pagination?.totalPages || 1
  );
  
  const products = useSelector(
    (state: RootState) => state.productClient.getProductsByCategory.products || []
  );
  const isLoading = useSelector(
    (state: RootState) => state.productClient.getProductsByCategory.isLoading
  );

  // Log categoryId, currentPage, totalPages, and isLoading
  console.log("Category ID:", categoryId);
  console.log("Current Page:", currentPage);
  console.log("Total Pages:", totalPages);
  console.log("Is Loading:", isLoading);
  console.log("Products:", products);

  useEffect(() => {
    if (categoryId) {
      console.log("Dispatching thunk for category:", categoryId, "page:", currentPage);
      dispatch(getProductsByCategoryThunk({ categoryId, page: currentPage }));
    }
  }, [dispatch, currentPage, categoryId]);

  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
    if (categoryId) {
      dispatch(getProductsByCategoryThunk({ categoryId, page }));
    }
  };
  return (
    <div className="bg-white">
      <ReusableBreadcrumbClient items={breadcrumbItemClient.productlist} />
      {isLoading ? (
        <ProductSkeletonList length={12} />
      ) : (
        <>
          <section className={styles.sectionContainer}>
            <div className={styles.container}>
              <div className={styles.gridContainer}>
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
                  >
                    <a className="relative mx-3 mt-3 flex h-auto overflow-hidden rounded-xl">
                      <figure className="relative max-w-sm mt-2 transition-all duration-300 cursor-pointer filter grayscale-0">
                        <a href="#">
                          <img
                            className="object-cover rounded-s h-auto w-auto"
                            src={product.image[0]}
                            alt={`product ${index + 1}`}
                          />
                        </a>
                      </figure>
                      {product.product_discount && product.product_discount.discountPercent > 0 && (
                        <span className="absolute top-0 left-0 rounded-full bg-red-800 px-2 text-center text-sm font-normal text-white">
                          Giảm giá {product.product_discount.discountPercent}%
                        </span>
                      )}
                    </a>
                    <div className="pt-2">
                      <div className="mb-2 flex items-center justify-end gap-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            data-tooltip-target="tooltip-quick-look"
                            className="flex items-center rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            <svg
                              className="h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeWidth={2}
                                d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                              />
                              <path
                                stroke="currentColor"
                                strokeWidth={2}
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                            <span className="sr-only">Quick look</span>
                          </button>

                          <div
                            id="tooltip-quick-look"
                            role="tooltip"
                            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                            data-popper-placement="top"
                          >
                            Quick look
                            <div className="tooltip-arrow" data-popper-arrow="" />
                          </div>

                          <button
                            type="button"
                            data-tooltip-target="tooltip-add-to-favorites"
                            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            <span className="sr-only">Add to Favorites</span>
                            <svg
                              className="h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                              />
                            </svg>
                          </button>

                          <div
                            id="tooltip-add-to-favorites"
                            role="tooltip"
                            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                            data-popper-placement="top"
                          >
                            Add to favorites
                            <div className="tooltip-arrow" data-popper-arrow="" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-1 px-2 pb-1">
                        <a href="#">
                          <h5 className="text-sm tracking-tight text-slate-900 font-medium">
                            {truncateText(product.product_name, 30)}
                          </h5>
                        </a>
                      </div>

                      <div className="mt-1 px-2 flex items-center gap-4">
                        <div className="price-box flex flex-col min-h-[2rem] items-center justify-center">
                          <p className="text-xs leading-tight text-gray-900 dark:text-white">
                            {product.product_discount.discountPercent > 1 ? (
                              <div>
                                <p className="text-xs font-medium text-rose-700">
                                  {formatCurrency(
                                    product.product_price *
                                      (1 - product.product_discount.discountPercent / 100)
                                  )}
                                  đ
                                </p>
                                <p className="text-xs font-medium line-through text-gray-400">
                                  {formatCurrency(product.product_price)}
                                </p>
                              </div>
                            ) : (
                              <p className="text-xs font-medium text-rose-700">
                                {formatCurrency(product.product_price)}đ
                              </p>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-1 mb-10 px-2 flex items-center gap-2">
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 text-yellow-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                          </svg>
                          <svg
                            className="h-4 w-4 text-yellow-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                          </svg>
                          <svg
                            className="h-4 w-4 text-yellow-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                          </svg>
                          <svg
                            className="h-4 w-4 text-yellow-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                          </svg>
                          <svg
                            className="h-4 w-4 text-yellow-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
