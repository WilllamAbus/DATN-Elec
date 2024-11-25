import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//css carosel sản phẩm liên quan
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  AppDispatch,
  RootState,
  useAppSelector,
} from "../../../../../redux/store";
import {
  addToWatchlistThunk,
  deleteWatchlistThunk,
  getWatchlistThunk,
} from "../../../../../redux/product/wathList/wathlist";
import {
  getProductByID,
  upViewProduct,
} from "../../../../../services/product_v2/client/homeAllProduct";
import {
  ProductAttribute,
  ProductRelated,
} from "../../../../../services/product_v2/client/types/homeAllProduct";
import currencyFormatter from "currency-formatter";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import Comment from "../../../../User/feature/details/comment/comment";
// import {
//   addProductToCart,
//   fetchCartList,
// } from "../../../../../redux/cart/cartThunk";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WatchlistItem } from "../../../../../types/cart/profile/wathlist";
import { HeartIcon, StarIcon } from "../../page-auction/svg";
import { fetchRelatedProducts } from "../../../../../services/detailProduct/relatedProducts";
const attributesToShow = ["Ram", "Color", "Storage", "Screen", "CPU", "Pin"];
import { getProfileThunk } from "../../../../../redux/auth/authThunk";
import { addInteractionView } from "../../../../../services/interaction/interaction.service";

function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}
export interface ProductRelatedList {
  productRelated: ProductRelated;
  index: number;
}

const ProductDetail: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [products, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductRelated[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState<
    Record<string, string | null>
  >({});
  const profile = useAppSelector(
    (state: RootState) => state.auth.profile.profile
  );

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
  const watchlistItems = useSelector((state: RootState) => state.watchlist);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  // const fetchData = async () => {
  //   // Kiểm tra sự tồn tại của ID sản phẩm và profile
  //   if (!id) {
  //     console.log("Product ID is not available.");
  //     return; // Nếu không có ID, không thực hiện
  //   }

  //   if (!profile?._id) {
  //     console.log("User profile is not available.");
  //     return; // Nếu không có profile, không thực hiện
  //   }

  //   const interactionData = {
  //     user: profile._id,
  //     orderAuctions: null,
  //     item: id,
  //     OrderCart: null,
  //     productID: id,
  //     Watchlist: null,
  //     type: "view",
  //     score: 2,
  //   };

  //   try {
  //     console.log("Fetching product with ID:", id);

  //     const productID = await getProductByID(id);
  //     setProduct(productID.product);
  //     console.log(productID.product);

  //     Promise.all([
  //       upViewProduct(id), // Cập nhật lượt xem sản phẩm
  //       addInteractionView(interactionData) // Cập nhật lượt tương tác
  //   ])

  //     const updatedProduct = await getProductByID(id);
  //     setProduct(updatedProduct);

  //     const relatedData = await fetchRelatedProducts(id);
  //     // Kiểm tra và thiết lập giá trị cho relatedProducts
  //     if (relatedData && Array.isArray(relatedData.relatedProducts)) {
  //       setRelatedProducts(relatedData.relatedProducts);
  //     } else {
  //       console.error("Error: relatedData is not an array", relatedData);
  //     }
  //   } catch (error) {
  //     console.error("Không thể lấy dữ liệu sản phẩm:", error);
  //   }
  // };
  // useEffect(() => {

  //   // Gọi hàm fetchData
  //   fetchData();
  //   fetchWatchlist();
  //   // Lấy thông tin profile
  //   dispatch(getProfileThunk());
  // }, [id, dispatch]); // Thêm profile vào dependency array
  const fetchWatchlist = async () => {
    try {
      const watchlistResponse = await dispatch(getWatchlistThunk()).unwrap();

      if (Array.isArray(watchlistResponse)) {
        const isFavoriteProduct = watchlistResponse.some(
          (item: WatchlistItem) => item?.product?._id === id
        );
        setIsFavorite(isFavoriteProduct);
        console.log(
          "Sản phẩm có trong danh sách yêu thích:",
          isFavoriteProduct
        );
      } else {
        console.error("Danh sách yêu thích không hợp lệ:", watchlistResponse);
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Không thể lấy danh sách yêu thích:", error);
    }
  };
  const fetchData = async () => {
    if (!id) {
      console.log("Thiếu ID sản phẩm hoặc profile người dùng.");
      return;
    }

    const interactionData = {
      user: profile?._id,
      orderAuctions: null,
      item: id,
      OrderCart: null,
      productID: id,
      Watchlist: null,
      type: "view",
      score: 2,
    };

    try {
      console.log("Đang lấy thông tin sản phẩm với ID:", id);
      const [productResponse, relatedData] = await Promise.all([
        getProductByID(id),
        fetchRelatedProducts(id),
      ]);

      setProduct(productResponse.product);

      if (relatedData && Array.isArray(relatedData.relatedVariants)) {
        setRelatedProducts(relatedData.relatedVariants);
      } else {
        console.error("Lỗi: relatedData không phải là mảng", relatedData);
      }

      await Promise.all([
        upViewProduct(id),
        addInteractionView(interactionData),
      ]);

      if (Array.isArray(watchlistItems)) {
        const isFavoriteProduct = watchlistItems.some(
          (item) => item.product && item.product._id === id
        );
        setIsFavorite(isFavoriteProduct);
      }
    } catch (error) {
      console.error("Không thể lấy hoặc cập nhật dữ liệu sản phẩm:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]); // Chỉ theo dõi `id` để tránh gọi lại khi các dependency khác thay đổi

  useEffect(() => {
    fetchWatchlist();
    dispatch(getProfileThunk());
  }, [dispatch]); // Tách riêng useEffect để tránh ảnh hưởng đến fetchData
  // const handleAddToCart = async () => {
  //   if (userId && id) {
  //     try {
  //       await dispatch(addProductToCart({ productId: id })).unwrap();
  //       toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
  //       dispatch(fetchCartList());

  //       console.log("Thêm Thành công");
  //     } catch (err) {
  //       console.error("Lỗi thêm giỏ hàng", err);
  //     }
  //   } else {
  //     console.log("chưa login");
  //   }
  // };
  const handleAddToWatchlist = async (variantId?: string) => {
    if (userId && id) {
      try {
        let resultAction;

        if (isFavorite) {
          resultAction = await dispatch(
            deleteWatchlistThunk({ productId: id, variantId })
          ).unwrap();
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
            addToWatchlistThunk({ productId: id })
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!id) {
  //       console.log("Không có ID sản phẩm nào được cung cấp");
  //       return;
  //     }
  //     try {
  //       const productID = await getProductByID(id);
  //       setProduct(productID.product);
  //       // console.log(productID.product);
  //       if (Array.isArray(watchlistItems)) {
  //         const isFavoriteProduct = watchlistItems.some(
  //           (item) => item.product && item.product._id === id
  //         );
  //         setIsFavorite(isFavoriteProduct);
  //       }
  //     } catch (error) {
  //       console.log(
  //         "Không thể lấy dữ liệu sản phẩm hoặc tăng số lượt xem:",
  //         error
  //       );
  //     }
  //   };
  //   fetchData();
  // }, [id, userId, dispatch, watchlistItems]);
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
            {products?.image
              ?.slice(0, 4)
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
                products.product_attributes
                  ?.filter((attribute: ProductAttribute) =>
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
              // onClick={() => handleAddToCart()}
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
            {products?.product_attributes
              ?.filter((attribute: ProductAttribute) =>
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

      {/* <Comment /> */}

      <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Sản phẩm liên quan
        </h2>
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={10}
          navigation // Kích hoạt navigation
          pagination={{ clickable: true }} // Kích hoạt pagination
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {relatedProducts.map((productRelated, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                <div className="backdrop-blur-sm bg-white/30">
                  <Link to={`/detailProd/${productRelated._id}`}>
                    <figure className="relative w-full h-0 pb-[75%] overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0">
                      <img
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        src={productRelated.image[0].image[0] || "null"}
                        alt={`product ${index + 1}`}
                      />
                    </figure>
                  </Link>
                </div>

                <div className="pt-1 mb-10">
                  <div className="mb-4 px-2 flex items-center justify-between gap-4">
                    {productRelated.product_discount.discountPercent > 0 ? (
                      <span className="rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        Giảm giá{" "}
                        {productRelated.product_discount.discountPercent}%
                      </span>
                    ) : null}
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <HeartIcon fill="red" size="1em" />
                      </button>
                    </div>
                  </div>
                  <div className="text-md font-semibold leading-tight text-gray-900 hover:text-balance dark:text-white">
                    <div className="mt-1 px-2 pb-1">
                      <a href="#">
                        <h5 className="text-sm tracking-tight text-slate-900 font-medium">
                          {productRelated.variant_name}
                        </h5>
                      </a>
                    </div>
                  </div>

                  <div className="px-2 flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {productRelated.product_ratingAvg
                        ? productRelated.product_ratingAvg.toFixed(1)
                        : "N/A"}
                    </p>
                    <StarIcon />
                    {/* <div className="text-xs text-gray-500 items-center">
                      {productRelated.product_quantity > 0
                        ? `(Còn ${productRelated.product_quantity} sản phẩm)`
                        : "Hết hàng"}
                    </div> */}
                  </div>
                  <div className="mt-2 px-2 flex items-center gap-2">
                    {productRelated.product_discount.discountPercent > 0 ? (
                      <div className="flex w-full">
                        <p className="text-xs font-medium text-rose-700 flex-grow">
                          {formatCurrency(
                            productRelated.variant_price *
                              (1 -
                                productRelated.product_discount
                                  .discountPercent /
                                  100)
                          )}{" "}
                          đ
                        </p>
                        <p className="text-xs font-medium text-gray-400 line-through flex-shrink-0">
                          {formatCurrency(productRelated.variant_price)} đ
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-rose-700">
                        {formatCurrency(productRelated.variant_price)} đ
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <ToastContainer />
      </div>
    </>
  );
};

export default ProductDetail;
