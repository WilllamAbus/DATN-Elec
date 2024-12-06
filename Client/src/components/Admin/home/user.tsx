import { useEffect, useState } from "react";
import {
  topViewProduct,
  totalProductsSold,
  totalUser
} from "../../../services/statistical/statistical.service";
import currencyFormatter from "currency-formatter";
import { Link } from "react-router-dom";

function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}
const UserStatistics = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any[]>([]);
  const [numberOfProducts, setNumberOfProducts] = useState(3);
  const [productSold, setProductSold] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await topViewProduct();

      if (Array.isArray(response.data)) {
        setProducts(response.data);
        return response.data;
      } else {
        setProducts([]);
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const totalProductSold = async () => {
    try {
      const response = await totalProductsSold();
      setProductSold(response.totalProductsSold);
      return response.totalProductsSold;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUser = async()=>{
  try{
    const respone = await totalUser();
    setUser(respone.data);
    
  }catch(error){
    console.log(error);
  }
  
  }
  useEffect(() => {
    fetchProducts();
    totalProductSold();
    fetchUser();
  }, []);
  const handleNumberChange = (event: any) => {
    setNumberOfProducts(Number(event.target.value));
  };
  return (
    <>
      {/* sản phẩm mới  */}
      <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="w-full">
          <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
            Số lượng sản phẩm đã bán ra
          </h3>
          <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            {productSold} sản phẩm
          </span>
          
        </div>
        <div className="w-full" id="new-products-chart" />
      </div>
      {/* user */}
      <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="w-full">
          <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
            Số lượng tài khoản trên hệ thống
          </h3>
          <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
          {user.length} tài khoản
          </span>
          
        </div>
        <div className="w-full" id="week-signups-chart" />
      </div>
      {/* top 5 sản phẩm có lượt xem cao nhất  */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="w-full">
          <div className="flex space-x-2 items-center mb-4">
            <h3 className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
              Top sản phẩm có lượt xem cao nhất
            </h3>
            <select
              value={numberOfProducts}
              onChange={handleNumberChange}
              className="rounded-lg "
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </div>

          <div>
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
              <div className="mb-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.slice(0, numberOfProducts).map((product, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="h-56 w-auto">
                      <Link to={`/detailProd/${product._id}`}>
                        <figure className="relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale-0">
                          <a href="#">
                            <img
                              className="rounded-lg"
                              src={product.image[0]}
                              alt={`product ${index + 1}`}
                            />
                          </a>
                        </figure>
                      </Link>
                    </div>
                    <div className="pt-6">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        {/* {product.product_discount.discountPercent > 0 ? (
                          <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                            Giảm giá {product.product_discount.discountPercent}%
                          </span>
                        ) : (
                          <span className="me-2 rounded px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"></span>
                        )} */}
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            data-tooltip-target="tooltip-quick-look"
                            className="flex items-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            {product.totalViewCount > 0 ? (
                              <span className="mr-2">
                                ({product.totalViewCount})
                              </span>
                            ) : (
                              ""
                            )}

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
                            <span className="sr-only"> Quick look </span>
                          </button>

                          <div
                            id="tooltip-quick-look"
                            role="tooltip"
                            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                            data-popper-placement="top"
                          >
                            fcdsf Quick look
                            <div
                              className="tooltip-arrow"
                              data-popper-arrow=""
                            />
                          </div>

                          <div
                            id="tooltip-add-to-favorites"
                            role="tooltip"
                            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                            data-popper-placement="top"
                          >
                            Add to favorites
                            <div
                              className="tooltip-arrow"
                              data-popper-arrow=""
                            />
                          </div>
                        </div>
                      </div>
                      <a
                        href="#"
                        className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white"
                      >
                        {product.productName}
                      </a>
                      <div className="mt-2 flex items-center gap-2">
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
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                         4.5
                        </p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {" "}
                          <div className="flex gap-1 text-sm text-yellow-400">
                            {Array.from({ length: product.rating }, (_, i) => (
                              <span key={i}>
                                <i className="fa-solid fa-star"></i>
                              </span>
                            ))}
                          </div>
                        </p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between gap-6">
                        <p className="text-xs leading-tight text-gray-900 dark:text-white">
                          {/* {product.product_discount.discountPercent > 1 ? (
                            <div>
                              <p className="text-xs font-medium text-rose-700">
                                {formatCurrency(
                                  product.product_price *
                                    (1 -
                                      product.product_discount.discountPercent /
                                        100)
                                )}
                                đ
                              </p>
                              <p className="text-xs font-medium line-through text-gray-400">
                                {formatCurrency(product.product_price)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs font-medium text-rose-700">
                              {formatCurrency(product.productPrice)}đ
                            </p>
                          )} */}
                          <p className="text-xs font-medium text-rose-700">
                              {formatCurrency(product.productPrice)}đ
                            </p>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div id="traffic-channels-chart" className="w-full" />
      </div>
    </>
  );
};
export default UserStatistics;
