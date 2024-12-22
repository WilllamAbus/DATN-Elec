import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import PlaceholderImage from "../../../../../common/images/PlaceholderImage";
import { ProductAuction } from "../../../../../services/detailProductAuction/types/detailAuction";
interface ImageAuctionProps {
  productDetailAuction: ProductAuction;
  product_name: string;
}
const ImageAuction: React.FC<ImageAuctionProps> = ({ productDetailAuction, product_name }) => {
  const mainSwiperRef = useRef<any>(null);
  const thumbSwiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { image } = productDetailAuction;
  return (
    <div className="shrink-0 max-w-md lg:max-w-xl mx-auto bg-white sm:rounded-md overflow-hidden">
      <Swiper
        spaceBetween={10}
        navigation={true}
        modules={[FreeMode, Navigation, Thumbs]}
        thumbs={{ swiper: thumbSwiperRef.current }}
        className="mySwiper"
        onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {Array.isArray(image) && image.map((imageUrl, index) => (
          <SwiperSlide key={index} className="grid gap-4">
            <div className="backdrop-blur-sm bg-white/30 rounded-lg overflow-hidden shadow-sm">
              <figure className="relative w-full h-full py-2 overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product_name}
                    className="w-full h-full object-contain rounded-lg"
                    style={{ maxHeight: '250px' }}
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    <PlaceholderImage />
                  </div>
                )}
              </figure>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={(swiper) => (thumbSwiperRef.current = swiper)}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        className="mySwiperThumbs mt-4"
      >
        {Array.isArray(image) && image.map((imageUrl, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center p-2">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product_name}
                className={`max-w-full h-32 object-cover rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 ${activeIndex === index ? 'border-solid border-2 border-sky-500' : ''
                  }`}
                style={{ maxHeight: '100px' }} 
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <PlaceholderImage />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export default ImageAuction;
