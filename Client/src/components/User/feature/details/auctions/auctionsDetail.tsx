import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
// import {
//   addToWatchlistThunk,
//   deleteWatchlistThunk,
// } from "../../../../../redux/product/wathList/wathlist";
import { fetchProductByTimeTrack } from "../../../../../redux/timeTrackProduct/timeTrackProdThunk";
import {
  ProductDetails,
  ProductImage,
  ProductResponse,
} from "../../../../../types/timeTrackProduct/timeTrackProduct";
import currencyFormatter from "currency-formatter";
// import "../../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import Comment from "../../../../User/feature/details/comment/comment";
import ModalPopUp from "../../../MoalButton";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
// import { getProfileThunk } from "../../../../../redux/auth/authThunk";
// import { addInteractionAuction } from "../../../../../services/interaction/interaction.service";
interface ProductDetailsProps {
  productId: string;
  // Dữ liệu người dùng
}
import ListRecommendation from "../../../recommendation";



function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}


const AuctDetail: React.FC<ProductDetailsProps> = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [, setSelectedValues] = useState<Record<string, string | null>>({});
  const { productId } = useParams<{ productId: string }>();
  // const userId = useSelector(
  //   (state: RootState) => state.auth.profile.profile?._id
  // );
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<ProductDetails | null>(null); // Initialize with null or an appropriate type
  const { productTimeTrack, loading, error } = useSelector(
    (state: RootState) => state.productByTimeTrack
  );
  const [timeLeft, setTimeLeft] = useState<string>("");
  const watchlistItems = useSelector(
    (state: RootState) => state.watchlist.items
  );
  const [, setIsFavorite] = useState<boolean>(false);
  // const profile = useAppSelector(
  //   (state: RootState) => state.auth.profile.profile
  // );
  // const handleChange = (attributeKey: string, value: string) => {
  //   setSelectedValues((prev) => ({
  //     ...prev,
  //     [attributeKey]: value,
  //   }));
  // };

  // const handleAddToWatchlist = async (variantId: string) => {
  //   if (userId && productId) {
  //     try {
  //       let resultAction;

  //       if (isFavorite) {
  //         resultAction = await dispatch(
  //           deleteWatchlistThunk({ variantId })
  //         ).unwrap();
  //         if (deleteWatchlistThunk.fulfilled.match(resultAction)) {
  //           setIsFavorite(false);
  //         } else {
  //           console.log(resultAction);
  //         }
  //       } else {
  //         resultAction = await dispatch(
  //           addToWatchlistThunk({ variantId })
  //         ).unwrap();
  //         if (addToWatchlistThunk.fulfilled.match(resultAction)) {
  //           setIsFavorite(true);
  //         } else {
  //           console.log(resultAction);
  //         }
  //       }
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         console.log(err.message);
  //       }
  //     }
  //   } else {
  //     console.log("User ID or Product ID is missing");
  //   }
  // };

  const changeMainImage = (index: number) => {
    setCurrentIndex(index);
  };



  useEffect(() => {
    if (productId) {
      dispatch(fetchProductByTimeTrack(productId))
        .unwrap()
        .then((data: ProductResponse) => {
          if (data?.data) {
            setProduct(data.data); // Access the 'data' property to set product details
          } else {
            setProduct(null); // Clear product data if not found
          }
        })
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [productId, dispatch]);
  useEffect(() => {
    if (product?.endTime) {
      const endTime = new Date(product.endTime); // Define endTime here

      const updateTimes = () => {
        const now = new Date();
        setCurrentTime(
          format(now, "HH:mm:ss 'Ngày' EEEE, d MMMM 'năm' yyyy  ", {
            locale: vi,
          })
        );
        setTimeLeft(calculateTimeLeft(endTime));
      };

      updateTimes();
      const timer = setInterval(updateTimes, 1000);

      return () => clearInterval(timer);
    }
  }, [product]);

  useEffect(() => {
    if (productTimeTrack) {
      setProduct(productTimeTrack.data); // Extract data from ProductResponse
    } else {
      setProduct(null); // Clear product if no productTimeTrack
    }

    if (Array.isArray(watchlistItems)) {
      const isFavoriteProduct = watchlistItems.some(
        (item) => item.product && item.product._id === productId
      );
      setIsFavorite(isFavoriteProduct); // Set favorite status based on watchlist
    }
  }, [productTimeTrack, watchlistItems, productId]);

  const calculateTimeLeft = (endDate: Date) => {
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    if (difference <= 0) {
      return "Hết thời gian";
    }

    const totalSeconds = Math.floor(difference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // const years = Math.floor(totalDays / 365);
    // const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays % 30;

    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    return ` ${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <p>Loading...</p>;
  }

  const formattedEndTime = product.endTime
    ? format(
        parseISO(product.endTime),
        "HH:mm:ss 'Ngày' EEEE, d MMMM 'năm' yyyy",
        {
          locale: vi,
        }
      )
    : "";
  const productPrice = product.product_price_unit ?? 0;

  return (
    <>
      {/* Breadcrumb */}
      <div className="container py-4 flex items-center gap-3">
        <a href="/" className="text-primary text-base flex items-center">
          <span className="ml-2">Sản phẩm</span>
        </a>
        <span className="text-sm text-gray-400 mx-2">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">Chi tiết sản phẩm</p>
      </div>

      {/* Product Detail */}
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Product Images */}
        <div>
          <div className="flex justify-center items-center mb-4">
            {product.images && product.images[currentIndex] ? (
              <img
                src={product.images[currentIndex].url} // Use 'url'
                alt="Ảnh chính" // Use 'alt'
                className="w-full h-auto object-cover"
                style={{ height: 430 }}
              />
            ) : (
              <p>No image available</p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {(product.images || [])
              .slice(0, 4)
              .map((img: ProductImage, index: number) => (
                <img
                  src={img.url} // Use 'url'
                  alt={`Image ${index}`}
                  className="w-20 h-16 object-cover cursor-pointer 
                    border border-gray-300 rounded"
                  key={index}
                  onClick={() => changeMainImage(index)}
                />
              ))}
          </div>
        </div>

        {/* Product Information */}
        <div>
          <h2 className="text-3xl font-semibold uppercase mb-2">
            {product.product_name}
          </h2>
          {/* <div className="flex items-center mb-4">
            <div className="flex gap-1 text-sm text-gray-800">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  <i className="fa-solid fa-star"></i>
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 ml-3">
              ({product?.product_view} Lượt xem)
            </div>
          </div> */}

          <div className="space-y-2 mb-4">
            {/* <p className="text-gray-800 font-semibold">
              <span>Trạng thái: </span>
              {product.product_quantity > 0 ? (
                <span className="text-green-600">Còn Hàng</span>
              ) : (
                <span className="text-red-600">Hết Hàng</span>
              )}
            </p> */}
            <p className="text-red-600 font-roboto font-bold">
              <span>Thời gian hiện tại: {currentTime}</span>
            </p>

            <p className="text-red-600 font-roboto font-bold ">
              {/* <span>Thời gian kết thúc: </span>
              <span>{endTime.toLocaleString()}</span> */}
              <span>Thời gian kết thúc: {formattedEndTime}</span>
            </p>

            <p className="text-gray-800 font-roboto font-bold ">
              {/* <span>Thời gian kết thúc: </span>
              <span>{endTime.toLocaleString()}</span> */}

              <span>Giờ còn lại: {timeLeft}</span>
            </p>

            <p className="text-yellow-400 font-roboto font-bold text-xl ">
              {/* <span>Thời gian kết thúc: </span>
              <span>{endTime.toLocaleString()}</span> */}

              <span>Điều kiện: {product.product_condition}</span>
            </p>
          </div>

          <div className="flex items-baseline mb-4 space-x-2 font-roboto">
            <p className="text-2xl text-primary font-semibold">
              {formatCurrency(productPrice)}đ
            </p>
          </div>

          {/* Option Selector */}
          <div className="pt-2">
            {/* <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Các phiên bản</h3> */}
            <div className="flex flex-wrap gap-2"></div>
          </div>

          <div className="mt-6 flex gap-3 border-t border-gray-200 pt-5">
            {productId && <ModalPopUp productId={productId} />}

            {/* <button
              //  onClick={() => handleAddToWatchlist(productId)}
              className="flex items-center space-x-2 bg-gray-200
               text-white px-4 py-2 font-medium rounded uppercase hover:bg-gray-300 transition"
            >
              <i
                className={`fas fa-heart ${
                  isFavorite ? "text-red-500" : "text-gray-500"
                }`}
              ></i>
              <span className="ml-2 text-slate-950">Yêu thích</span>
            </button> */}
          </div>
        </div>
      </div>

      <div className="container pb-16">
        <h3 className="border-b border-gray-200 font-roboto text-gray-800 pb-3 font-medium text-xl">
          Thông tin chi tiết
        </h3>
        <div className="pt-6">
          <table className="table-auto border-collapse w-full text-left text-gray-600 text-sm">
            <li>
              <strong>Khối lượng:</strong> <span>{product.weight_g} g</span>
            </li>

            {/* <tbody>
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
            </tbody> */}
          </table>
        </div>
      </div>

      {/* Comments Section */}

      {/* <Comment  /> */}

      {/* related-products */}
      <div className="text-left">
        <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-3xl xl:text-4xl uppercase py-10 px-10">
          Sản phẩm dành cho bạn
        </h2>
      </div>
      <ListRecommendation />
    </>
  );
};

export default AuctDetail;
