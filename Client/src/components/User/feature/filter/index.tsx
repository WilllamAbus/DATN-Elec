import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import { loadPrice } from "../../../../services/product/crudProduct.service";
import currencyFormatter from "currency-formatter";
import Example from "../gallery/allListing";

function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}

const Search: React.FC = () => {
  const { price } = useParams<{ price: string }>();
  const [products, setProducts] = useState<any[]>([]);
  let key: string;

  switch (price) {
    case 'price-0':
      key = 'Dưới 500.000 VNĐ'; 
      break;
    case 'price-1':
      key = '500.000 VNĐ - 1.000.000 VNĐ'; 
      break;
    case 'price-2':
      key = '1.000.000 VNĐ - 3.000.000 VNĐ';
      break;
    case 'price-3':
      key = '3.000.000 VNĐ - 5.000.000 VNĐ';
      break;
    case 'price-4':
      key = 'Trên 5.000.000 VNĐ'; 
      break;
    default:
      key = 'Khoảng giá không hợp lệ';
      break;
  }

  const fetchProducts = async () => {
    if (price) {
      try {
        const result = await loadPrice(price);
        setProducts(result.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      console.log("Lỗi");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [price]);

  return (
    <>
      {/* Breadcrumb */}
   
      {/* ./Breadcrumb */}

      {/* Shop wrapper */}
      <div className="container flex gap-6 pt-4 pb-16 items-start">
        {/* Sidebar */}
        <div className="w-1/4">
          {/* Filter drawer */}
          <Example />
        </div>
        {/* ./Sidebar */}

        {/* Products */}
        <div className="w-3/4">
          <h1 className="text-center text-3xl mb-6">Khoảng giá: {key}</h1>
          {(price ?? "").length > 0 && (
            <div className="grid md:grid-cols-3 grid-cols-2 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="h-56 w-full">
                      <Link to={`/detailProd/${product._id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="mx-auto h-full dark:hidden"
                        />
                      </Link>
                    </div>
                    <div className="pt-6">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        {product.discount > 0 ? (
                          <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                            Up to {product.discount}% off
                          </span>
                        ) : (
                          <span className="me-2 rounded px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"></span>
                        )}
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            data-tooltip-target="tooltip-quick-look"
                            className="flex items-center space-x-2 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            <p className="text-xs">({product.view})</p>
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
                          </button>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No products found.</p>
              )}
            </div>
          )}
        </div>
        {/* ./Products */}
      </div>
      {/* ./Shop wrapper */}
    </>
  );
};

export default Search;
