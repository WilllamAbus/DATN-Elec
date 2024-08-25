import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { addToWatchlistThunk } from "../../../../../redux/product/wathlist";
import {
  getOneProduct,
  upViewProduct,
} from "../../../../../services/product/crudProduct.service";
import { getFileFirebase } from "../../../../../services/firebase/getFirebse.service";
import currencyFormatter from "currency-formatter";
import "../../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Comment from "../../../../User/feature/details/comment/comment";

function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}

const ProductDetail: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const userId = useSelector(
    (state: RootState) => state.auth.profile.profile?._id
  );
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const watchlistStatus = useSelector(
    (state: RootState) => state.watchlist.wathlist.status
  );
  const watchlistItems = useSelector(
    (state: RootState) => state.watchlist.wathlist.items
  );
  console.log("wathlist", watchlistItems);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToWatchlist = async () => {
    if (userId && id) {
      try {
        await dispatch(addToWatchlistThunk({ userId, productId: id })).unwrap();
        setIsFavorite(true);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    } else {
      console.log("User ID or Product ID is missing");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.log("Không có ID sản phẩm nào được cung cấp");
        return;
      }
      try {
        console.log("Fetching product with ID:", id);
        const product = await getOneProduct(id);
        setProduct(product);

        if (product.image) {
          const url = await getFileFirebase(product.image);
          setImgPreview(url);
        }

        const viewedProducts = JSON.parse(
          localStorage.getItem("viewedProducts") || "[]"
        );
        if (!viewedProducts.includes(id)) {
          await upViewProduct(id);
          viewedProducts.push(id);
          localStorage.setItem(
            "viewedProducts",
            JSON.stringify(viewedProducts)
          );

          const updatedProduct = await getOneProduct(id);
          setProduct(updatedProduct);
          console.log("Tăng lượt xem thành công");
        } else {
          console.log("Sản phẩm đã được xem");
        }

        if (Array.isArray(watchlistItems)) {
          const isFavoriteProduct = watchlistItems.some((item) => {
            const product = item.product || item.data?.product;
            return product && product._id === id;
          });
          console.log("Is favorite:", isFavoriteProduct);
          setIsFavorite(isFavoriteProduct);
        } else {
          console.log("Watchlist items is not an array");
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
          <i className="fa-solid fa-house"></i>
          <span className="ml-2">Home</span>
        </a>
        <span className="text-sm text-gray-400 mx-2">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">Product</p>
      </div>

      {/* product-detail */}
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center items-center">
          {imgPreview && (
            <img
              src={imgPreview}
              alt="Image Preview"
              className="w-full max-w-md object-cover"
            />
          )}
        </div>

        <div>
          <h2 className="text-3xl font-semibold uppercase mb-2">
            {product?.name}
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
              ({product?.view} Lượt xem)
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-gray-800 font-semibold">
              <span>Trạng thái: </span>
              {product?.quantity > 0 ? (
                <span className="text-green-600">Còn Hàng</span>
              ) : (
                <span className="text-red-600">Hết Hàng</span>
              )}
            </p>
          </div>

          <div className="flex items-baseline mb-4 space-x-2 font-roboto">
            {product?.discount > 0 ? (
              <div>
                <p className="text-xl text-primary font-semibold">
                  {formatCurrency(
                    product?.price * (1 - product?.discount / 100)
                  )}{" "}
                  VNĐ
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {formatCurrency(product?.price)} VNĐ
                </p>
              </div>
            ) : (
              <p className="text-xl text-primary font-semibold">
                {formatCurrency(product?.price)} VNĐ
              </p>
            )}
          </div>

          {/* Size Selector */}
          <div className="pt-4">
            <h3 className="text-sm text-gray-800 uppercase mb-2">Kích thước</h3>
            <div className="flex items-center gap-2">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <div key={size} className="size-selector">
                  <input
                    type="radio"
                    name="size"
                    id={`size-${size.toLowerCase()}`}
                    className="hidden"
                  />
                  <label
                    htmlFor={`size-${size.toLowerCase()}`}
                    className="text-xs border border-gray-200 rounded-sm h-8 w-8 flex items-center justify-center cursor-pointer shadow-sm text-gray-600"
                  >
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="pt-4">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
              Màu sắc
            </h3>
            <div className="flex items-center gap-2">
              {["#fc3d57", "#000", "#fff"].map((color) => (
                <div key={color} className="color-selector">
                  <input
                    type="radio"
                    name="color"
                    id={color}
                    className="hidden"
                  />
                  <label
                    htmlFor={color}
                    className="border border-gray-200 rounded-sm h-8 w-8 cursor-pointer shadow-sm block"
                    style={{ backgroundColor: color }}
                  ></label>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mt-4">
            <h3 className="text-sm text-gray-800 uppercase mb-1">Số lượng</h3>
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

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3 border-t border-gray-200 pt-5">
            <a
              href="/checkout"
              className="bg-blue-600 text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <i className="fa-solid fa-bag-shopping"></i> Mua ngay
            </a>
            <a
              href="/cart"
              className="bg-green-600 text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-green-700 transition"
            >
              <i className="fa-solid fa-bag-shopping"></i> Thêm giỏ hàng
            </a>
            {error && <p className="text-red-500">{error}</p>}
            {/* Hiển thị thông báo lỗi */}
            <button
              onClick={handleAddToWatchlist}
              disabled={watchlistStatus === "loading"}
              className="bg-yellow-600 text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-yellow-700 transition"
            >
              <i
                className={`fa-solid fa-heart ${
                  isFavorite ? "text-red-500" : "text-white"
                }`}
              ></i>{" "}
              {watchlistStatus === "loading" ? "Adding..." : "Add to Watchlist"}
            </button>
          </div>

          {/* Social Media Share */}
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
          Product Details
        </h3>
        <div className="pt-6">
          <table className="table-auto border-collapse w-full text-left text-gray-600 text-sm">
            <tbody>
              {[
                ["Category", "A"],
                ["Product Code", "B"],
                ["Size", "C"],
                ["Weight", "D"],
                ["Color", "E"],
                ["Material", "F"],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td className="py-2 border-b">{label}</td>
                  <td className="py-2 border-b">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* comments */}
      {/* <div className="container py-8">
                <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded" role="alert">
                        Comment submitted successfully!
                    </div>
                <div>
                <div className="flex items-start space-x-4 mb-4">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src={Avatar} alt="avatar" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-800"></p>
                                    <p className="text-gray-600">Sản Phẩm Tốt!!!</p>
                                </div>
                          <p className="text-yellow-400">    
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p> 
                           </p>
                            </div>
                 </div>
                 <div className="flex items-start space-x-4 mb-4">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src={Avatar} alt="avatar" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-800"></p>
                                    <p className="text-gray-600">Good!!!</p>
                                </div>
                          <p className="text-yellow-400">    
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p> 
                           </p>
                            </div>
                 </div>
                </div>
                <form  className="mt-6">
                    <div className="flex items-center space-x-3">
                        <input type="text" name="contents" placeholder="Enter your comment..." className="border border-gray-300 px-4 py-2 w-full focus:outline-none focus:border-primary rounded-md" />
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition focus:outline-none">Submit</button>
                    </div>
                    <div className="text-gray-400">    
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p>
                            <p  className="fa fa-star"></p> 
                    </div>
                </form>
            </div> */}
      <Comment />
      {/* ./comments */}

      {/* related-products */}
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
              {/* <img
                src={listTwo}
                alt="related-product"
                className="w-full h-48 object-cover"
              /> */}
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
      </div>
    </>
  );
};

export default ProductDetail;
