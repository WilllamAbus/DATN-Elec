
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import {
  addToWatchlistThunk,
  deleteWatchlistThunk,
  getWatchlistThunk,
} from "../../../../../redux/product/wathList/wathlist";

import { getProductByID,upViewProduct} from "../../../../../services/product_v2/client/homeAllProduct";
import { ProductAttribute } from "../../../../../services/product_v2/client/types/homeAllProduct";
import currencyFormatter from "currency-formatter";
import "../../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Comment from "../../../../User/feature/details/comment/comment";
import {
  addProductToCart,
  fetchCartList,
} from "../../../../../redux/cart/cartThunk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WatchlistItem } from "../../../../../types/cart/profile/wathlist";
const attributesToShow = ["Ram", "Color", "Storage", "Screen", "CPU", "Pin"];

function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}

const ProductDetail: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [products, setProduct] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState<
    Record<string, string | null>
  >({});

  const handleChange = (attributeKey: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [attributeKey]: value,
    }));
  };
  const { id } = useParams<{ id: string }>();
  const userId = useSelector(
    (state: RootState) => state.auth.profile.profile?._id
  );
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const watchlistItems = useSelector(
    (state: RootState) => state.watchlist 
  );

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.log("Không có ID sản phẩm nào được cung cấp");
        return;
      }
      try {
        // Lấy thông tin sản phẩm
        console.log("Fetching product with ID:", id);
        const productID = await getProductByID(id);
        setProduct(productID.product);
        console.log(productID.product);
        await upViewProduct(id);
        const updatedProduct = await getProductByID(id);
        setProduct(updatedProduct);
        // Lấy danh sách yêu thích của người dùng
        const watchlistResponse = await dispatch(getWatchlistThunk()).unwrap();
        const isFavoriteProduct = watchlistResponse.some(
          (item: WatchlistItem) => item.product._id === id
        );
        setIsFavorite(isFavoriteProduct);
      } catch (error) {
        console.log(
          "Không thể lấy dữ liệu sản phẩm hoặc danh sách yêu thích:",
          error
        );
      }
    };
    fetchData();
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (userId && id) {
      try {
        await dispatch(addProductToCart({ userId, productId: id })).unwrap();
        toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
        dispatch(fetchCartList());

        console.log("Thêm Thành công");
      } catch (err) {
        console.error("Lỗi thêm giỏ hàng", err);
      }
    } else {
      console.log("chưa login");
    }
  };
  const handleAddToWatchlist = async () => {
    if (userId && id) {
      try {
        let resultAction;

        if (isFavorite) {
          resultAction = await dispatch(deleteWatchlistThunk(id)).unwrap();
          console.log("Delete result action:", resultAction);

          if (
            !resultAction ||
            typeof resultAction !== "object" ||
            !resultAction._id
          ) {
            setIsFavorite(false);
          } else {
            setIsFavorite(false);
          }
        } else {
          resultAction = await dispatch(
            addToWatchlistThunk({ userId, productId: id })
          ).unwrap();
          console.log("Add result action:", resultAction);

          if (
            !resultAction ||
            typeof resultAction !== "object" ||
            !resultAction._id
          ) {
            setError("Lỗi khi thêm vào DS theo doi");
            setIsFavorite(false);
          } else {
            setIsFavorite(true);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("lỗi xử lý ds theo dõi:", err.message);
          setError(err.message);
        } else {
          console.error("Đã xảy ra lỗi không xác định:", err);
          setError("Đã xảy ra lỗi không xác định.");
        }
      }
    } else {
      console.log("User ID or Product ID is missing");
      setError("User ID or Product ID is missing");
    }
  };

  const changeMainImage = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.log("Không có ID sản phẩm nào được cung cấp");
        return;
      }
      try {
        console.log("Fetching product with ID:", id);
        const productID = await getProductByID(id); 
        setProduct(productID.product);
        console.log(productID.product);
        if (Array.isArray(watchlistItems)) {
          const isFavoriteProduct = watchlistItems.some(
            (item) => item.product && item.product._id === id
          );
          setIsFavorite(isFavoriteProduct);
        }
      } catch (error) {
        console.log(
          "Không thể lấy dữ liệu sản phẩm hoặc tăng số lượt xem:",
          error
        );
      }
    };
    fetchData();
  }, [id, userId, dispatch, watchlistItems]);
  return (
    <>
      {/* breadcrumb */}
      <div className="container py-4 flex items-center gap-3">
        <a href="/" className="text-primary text-base flex items-center">
          <span className="ml-2">Sản phẩm</span>
        </a>
        <span className="text-sm text-gray-400 mx-2">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">Chi tiết sản phẩm</p>
      </div>

      {/* product-detail */}
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div>
          <div className="flex justify-center items-center mb-4">
            <img src={products?.image?.[currentIndex]} alt="Ảnh chính" />
          </div>
          <div className="flex justify-center gap-4">
            {products?.image?.slice(0, 4)
              .map((imgSrc: string | undefined, index: number) => (
                <img
                  key={index}
                  src={imgSrc}
                  className={`w-20 h-16 object-cover cursor-pointer border border-gray-300 rounded ${
                    index === currentIndex ? "border-blue-500" : ""
                  }`}
                  onClick={() => changeMainImage(index)}
                />
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold uppercase mb-2">
            {products?.product_name}
          </h2>
          <div className="flex items-center mb-4">
            <div className="flex gap-1 text-sm text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  <i className="fa-solid fa-star"></i>
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 ml-3">
              ({products?.product_view} Lượt xem)
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-gray-800 font-semibold">
              <span>Trạng thái: </span>
              {products?.product_quantity > 0 ? (
                <span className="text-green-600">Còn Hàng</span>
              ) : (
                <span className="text-red-600">Hết Hàng</span>
              )}
            </p>
          </div>

          <div className="flex items-baseline mb-4 space-x-2 font-roboto">
            {products?.product_discount?.discountPercent > 0 ? (
              <div>
                <p className="text-xl text-red-600 font-semibold">
                  {formatCurrency(
                    products?.product_price *
                      (1 - products?.product_discount?.discountPercent / 100)
                  )}
                  đ
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {formatCurrency(products?.product_price)}đ
                </p>
              </div>
            ) : (
              <p className="text-xl text-primary font-semibold">
                {formatCurrency(products?.product_price)}đ
              </p>
            )}
          </div>
          {/* optin Selector */}
          <div className="pt-2">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
              Các phiên bản
            </h3>
            <div className="flex flex-wrap gap-2">
              {products?.product_attributes?.length ? (
                products.product_attributes?.filter((attribute: ProductAttribute) =>
                    ["Ram", "Color"].includes(attribute.k)
                  )
                  .map((attribute: ProductAttribute, index: number) => (
                    <div key={index} className="flex flex-col gap-1">
                      <strong className="text-gray-800">{attribute.k}:</strong>
                      <div className="flex flex-wrap gap-2">
                        {attribute.v.split(",").map((value, i) => (
                          <div key={i} className="flex items-center">
                            <input
                              type="radio"
                              id={`${attribute.k}-${i}`}
                              name={attribute.k}
                              value={value.trim()}
                              checked={
                                selectedValues[attribute.k] === value.trim()
                              }
                              onChange={() =>
                                handleChange(attribute.k, value.trim())
                              }
                              className="hidden"
                            />
                            <label
                              htmlFor={`${attribute.k}-${i}`}
                              className={`border rounded-sm h-8 w-32 flex items-center justify-center cursor-pointer text-gray-600 ${
                                selectedValues[attribute.k] === value.trim()
                                  ? "border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {value.trim()}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              ) : (
                <div>Không có thuộc tính sản phẩm</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
              Số lượng
            </h3>
            <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
              <button
                className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none bg-gray-200 hover:bg-gray-300 transition"
                onClick={decreaseQuantity}
              >
                -
              </button>
              <div className="h-8 w-8 text-base flex items-center justify-center bg-gray-100">
                {quantity}
              </div>
              <button
                className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none bg-gray-200 hover:bg-gray-300 transition"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-6 flex gap-3 border-t border-gray-200 pt-5">
            <a
              href="/checkout"
              className="bg-blue-600 text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <i className="fa-solid fa-bag-shopping"></i> Mua ngay
            </a>
            <a
              // href="/cart"
              onClick={() => handleAddToCart()}
              className="bg-green-600 text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-green-700 transition"
            >
              <i className="fa-solid fa-bag-shopping"></i> Thêm giỏ hàng
            </a>
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={() => handleAddToWatchlist()}
              className="flex items-center space-x-2 bg-gray-200 text-white px-4 py-2 font-medium rounded uppercase hover:bg-gray-300 transition"
            >
              <i
                className={`fas fa-heart ${
                  isFavorite ? "text-red-500" : "text-gray-500"
                }`}
              ></i>
              <span className="ml-2 text-slate-950">Yêu thích</span>
            </button>
          </div>
          <div className="flex gap-3 mt-4">
            {["facebook-f", "twitter", "linkedin-in", "pinterest"].map(
              (platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-gray-400 hover:text-gray-500 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  <i className={`fa-brands fa-${platform}`}></i>
                </a>
              )
            )}
          </div>
        </div>
      </div>

      {/* description */}
      <div className="container pb-16">
        <h3 className="border-b border-gray-200 font-roboto text-gray-800 pb-3 font-medium text-xl">
          Thông tin chi tiết
        </h3>
        <div className="pt-6">
          <table className="table-auto border-collapse w-full text-left text-gray-600 text-sm">
            {products?.product_attributes?.filter((attribute: ProductAttribute) =>
                attributesToShow.includes(attribute.k)
              )
              .map((attribute: ProductAttribute, index: number) => (
                <li key={index} className="mb-1">
                  <strong>{attribute.k}: </strong>
                  <span>{attribute.v}</span>
                </li>
              ))}
            <li>
              <strong>Khối lượng:</strong> <span>{products?.weight_g} kg</span>
            </li>

       
          </table>
        </div>
      </div>


      <Comment />


      <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-gray-800 font-medium">
                  Related Product Name
                </h3>
                <p className="text-gray-600">Related Product Price</p>
                <button className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition focus:outline-none">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ProductDetail;
