import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useProductDetail } from "../../../../../hooks/useProductDetail";
import currencyFormatter from "currency-formatter";
import Star from "./svg/star";
import Heart from "./svg/Heart";
import Cart from "./svg/cart";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}
const DetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { productDetail } = useProductDetail(slug!);

  if (!productDetail) {
    return <p>No product found.</p>;
  } console.log(productDetail);

  const mainSwiperRef = useRef<any>(null);
  const thumbSwiperRef = useRef<any>(null);
  return (
    <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto ">
            <Swiper
              spaceBetween={10}
              modules={[FreeMode, Navigation, Thumbs]}
              thumbs={{ swiper: thumbSwiperRef.current }}
              className="mySwiper"
              onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
            >
              {Array.isArray(productDetail.variants) &&
                productDetail.variants.map((variant) =>
                  Array.isArray(variant.image) &&
                  variant.image.map((img, imgIndex) => (
                    <SwiperSlide key={imgIndex} className="flex justify-center items-center h-60 ">
                      <div className="backdrop-blur-sm bg-white/30">
                        <figure className="relative w-full h-0 pb-[100%] overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0 ">
                          <img
                            src={img}
                            alt={variant.variant_name || productDetail.product_name}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg p-4 "
                          />
                        </figure>
                      </div>


                    </SwiperSlide>
                  ))
                )}
            </Swiper>
            <Swiper
              onSwiper={(swiper) => (thumbSwiperRef.current = swiper)}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              className="mySwiperThumbs mt-4"
            >
              {Array.isArray(productDetail.variants) &&
                productDetail.variants.map((variant) =>
                  Array.isArray(variant.image) &&
                  variant.image.map((img, imgIndex) => (
                    <SwiperSlide key={imgIndex} className="flex justify-center items-center">
                      <img
                        src={img}
                        alt={variant.variant_name || productDetail.product_name}
                        className="max-w-full h-20 object-cover"
                      />
                    </SwiperSlide>
                  ))
                )}
            </Swiper>
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              {productDetail.variants?.[0]?.variant_name || productDetail.product_name}
            </h1>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
              <p className="text-2xl font-extrabold text-redCustom sm:text-3xl dark:text-white">
                {formatCurrency(productDetail.variants?.[0]?.variant_price ?? 0)}đ
              </p>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <div className="flex items-center gap-1">
                  <Star />
                </div>
                <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                  {productDetail.product_ratingAvg}
                </p>
                <a
                  href="#"
                  className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                >
                  {productDetail.product_view} Lượt xem
                </a>
              </div>
            </div>
            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
              <a
                href="#"
                title=""
                className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                role="button"
              >
                <Heart />
                Yêu thích
              </a>
              <a
                href="#"
                title=""
                className="text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center"
                role="button"
              >
                <Cart />
                Thêm vào giỏ
              </a>
            </div>
            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Colour</h3>
                <div className="mt-2 flex flex-wrap gap-4">
                {productDetail.variants?.[0]?.color && productDetail.variants[0].color.length > 0 ? (
                    <label key={productDetail.variants[0].color[0]._id} htmlFor={productDetail.variants[0].color[0].name} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        id={productDetail.variants[0].color[0]._id}
                        name="color"
                        value={productDetail.variants[0].color[0].name}
                        className="hidden peer"
                      />
                      <div className={`flex items-center justify-center w-24 h-10 border border-gray-300 rounded-md peer-checked:bg-${productDetail.variants[0].color[0].code}-50 peer-checked:text-${productDetail.variants[0].color[0].code}-700 peer-checked:border-${productDetail.variants[0].color[0].code}-700`}>
                        <p className="text-gray-600 dark:text-gray-300">{productDetail.variants[0].color[0].name}</p>
                      </div>
                    </label>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">No colors available</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SSD capacity</h3>
                <div className="mt-2 flex flex-wrap gap-4">
                  {/* Check if storage exists and is an object */}
                  {productDetail.variants?.[0]?.storage?.[0] ? (  // Access the first storage object
                    <label key={productDetail.variants[0].storage[0]._id} htmlFor={`capacity-${productDetail.variants[0].storage[0].name}`} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        id={`capacity-${productDetail.variants[0].storage[0]._id}`}
                        name="capacity"
                        value={productDetail.variants[0].storage[0].name}
                        className="hidden peer"
                      />
                      <div className="flex items-center justify-center w-24 h-10 border border-gray-300 rounded-md peer-checked:bg-gray-200 peer-checked:text-gray-700 peer-checked:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300">{productDetail.variants[0].storage[0].name}</p>
                      </div>
                    </label>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">No storage options available</p>
                  )}
                </div>
              </div>
            </div>












          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailPage;
