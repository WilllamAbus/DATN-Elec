import { useEffect, useState } from "react";
import { topViewProduct,totalProductsSold } from "../../../services/statistical/statistical.service";
// import currencyFormatter from "currency-formatter";
import { Link } from "react-router-dom";

// function formatCurrency(value: number) {
//   return currencyFormatter.format(value, { code: "VND", symbol: "" });
// }
const UserStatistics = () => {
  const [products, setProducts] = useState<any[]>([]);
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
  const totalProductSold = async ()=>{
    try{
      const response = await totalProductsSold();
      setProductSold(response.totalProductsSold)
      return response.totalProductsSold;
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProducts();
    totalProductSold();
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
            {productSold}
          </span>
          <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
            <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                />
              </svg>
              Tăng 12.5%
            </span>
            So với tuần trước
          </p>
        </div>
        <div className="w-full" id="new-products-chart" />
      </div>
      {/* user */}
      <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="w-full">
          <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
            Tài Khoản
          </h3>
          <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            45 tài khoản
          </span>
          <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
            <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                />
              </svg>
              Tăng 3,4%
            </span>
            So với tuần trước
          </p>
        </div>
        <div className="w-full" id="week-signups-chart" />
      </div>
      {/* top 5 sản phẩm có lượt bán nhiều nhất  */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="w-full">
          <h3 className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
            Top 5 sản phẩm có lượt bán nhiều nhất
          </h3>
          <div className="flex items-center mb-2">
            <div className="w-16 text-sm font-medium dark:text-white">50+</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500"
                style={{ width: "18%" }}
              />
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-16 text-sm font-medium dark:text-white">40+</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500"
                style={{ width: "15%" }}
              />
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-16 text-sm font-medium dark:text-white">30+</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500"
                style={{ width: "60%" }}
              />
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-16 text-sm font-medium dark:text-white">20+</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500"
                style={{ width: "30%" }}
              />
            </div>
          </div>
        </div>
        <div id="traffic-channels-chart" className="w-full" />
      </div>
      {/* top 5 sản phẩm có lượt xem cao nhất  */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="w-full">
          <div className="flex space-x-2 items-center mb-4">
          <h3 className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
            Top sản phẩm có lượt xem cao nhất
          </h3>
          <select value={numberOfProducts} onChange={handleNumberChange} className="rounded-lg ">
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
                    
                      <a
                        href="#"
                        className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white"
                      >
                        {product.product_name}
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
                          5.0
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
                          <div className="text-xs text-gray-500 items-center m-3">
                            {product.product_quantity > 0
                              ? `(Còn ${product.product_quantity} sản phẩm)`
                              : " "}
                          </div>
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
