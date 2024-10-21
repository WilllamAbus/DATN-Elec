import React, { useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ProductVariant  } from "../../../../../../services/detailProduct/types/getDetailProduct";  
interface VariantImageGalleryProps {
  variants: ProductVariant[]; 
  product_name: string;
}

const VariantImageGallery: React.FC<VariantImageGalleryProps> = ({ variants, product_name }) => {
  const mainSwiperRef = useRef<any>(null);
  const thumbSwiperRef = useRef<any>(null);

  return (
    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto bg-white shadow sm:rounded-md overflow-hidden">
      <Swiper
        spaceBetween={10}
        navigation={true}
        modules={[FreeMode, Navigation, Thumbs]}
        thumbs={{ swiper: thumbSwiperRef.current }}
        className="mySwiper"
        onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
      >
        {Array.isArray(variants) &&
          variants.map((variant) =>
            Array.isArray(variant.image) &&
            variant.image.map((img, imgIndex) => (
              <SwiperSlide key={imgIndex} className="flex justify-center items-center h-60">
            <div className="backdrop-blur-sm bg-white/30 rounded-lg overflow-hidden shadow-sm">
            <figure className="relative w-full h-full py-2 overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0">
                    <img
                      src={img}
                      alt={variant.variant_name || product_name}
                      className="w-full h-full object-contain rounded-lg" 
                      style={{ maxHeight: '250px' }}
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
        {Array.isArray(variants) &&
          variants.map((variant) =>
            Array.isArray(variant.image) &&
            variant.image.map((img, imgIndex) => (
              <SwiperSlide key={imgIndex} className="flex justify-center items-center p-2">
                <img
                  src={img}
                  alt={variant.variant_name || product_name}
                  className="max-w-full h-20 object-cover rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105"
                  style={{ maxHeight: '50px' }} 
                />
              </SwiperSlide>
            ))
          )}
      </Swiper>
    </div>
  );
};

export default VariantImageGallery;
