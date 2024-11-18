import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import PlaceholderImage from "../../../../../../common/images/PlaceholderImage";
import { ProductVariant } from "../../../../../../services/detailProduct/types/getDetailProduct";

interface VariantImageGalleryProps {
  variants: ProductVariant[];
  product_name: string;
  selectedColor: string | null; // Nhận màu sắc đã chọn
}

const VariantImageGallery: React.FC<VariantImageGalleryProps> = ({ variants, product_name, selectedColor }) => {
  const mainSwiperRef = useRef<any>(null);
  const thumbSwiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Lọc các biến thể theo màu sắc đã chọn
  const filteredVariants = selectedColor
    ? variants.filter((variant) => variant.color?.some(color => color._id === selectedColor))
    : variants;

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
        {Array.isArray(filteredVariants) &&
          filteredVariants.map((variant, variantIndex) => (
            Array.isArray(variant.image) && variant.image.map((imgObj, imgIndex) => (
              Array.isArray(imgObj.image) && imgObj.image.map((imageUrl, imageIndex) => (
                <SwiperSlide key={`${variantIndex}-${imgIndex}-${imageIndex}`} className="grid gap-4">
                  <div className="backdrop-blur-sm bg-white/30 rounded-lg overflow-hidden shadow-sm">
                    <figure className="relative w-full h-full py-2 overflow-hidden transition-all duration-300 cursor-pointer filter grayscale-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl} // Lấy URL hình ảnh
                          alt={variant.variant_name || product_name}
                          className="w-full h-full object-contain rounded-lg "
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
              ))
            ))
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
        {Array.isArray(filteredVariants) &&
          filteredVariants.map((variant, variantIndex) => (
            Array.isArray(variant.image) &&
            variant.image.map((imgObj, imgIndex) => (
              Array.isArray(imgObj.image) && imgObj.image.length > 0 ? ( // Kiểm tra xem có mảng hình ảnh không
                imgObj.image.map((imageUrl, index) => ( // Lặp qua tất cả các hình ảnh trong imgObj
                  <SwiperSlide key={`${variantIndex}-${imgIndex}-${index}`}
                    className="flex justify-center items-center p-2 ">
                    <img
                      src={imageUrl} // Lấy URL hình ảnh
                      alt={variant.variant_name || product_name}
                      className={`max-w-full h-20 object-cover rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105  ${activeIndex === index ? 'border-solid border-2 border-sky-500' : ''}`}
                      style={{ maxHeight: '50px' }}
                    />
                  </SwiperSlide>
                ))
              ) : (
                // Nếu không có hình ảnh, bạn có thể hiển thị một placeholder
                <SwiperSlide key={`${variantIndex}-${imgIndex}`} className="flex justify-center items-center p-2">
                  <div className="w-full h-full flex justify-center items-center">
                    <PlaceholderImage /> {/* Hiển thị PlaceholderImage nếu không có hình ảnh */}
                  </div>
                </SwiperSlide>
              )
            ))
          ))}
      </Swiper>

    </div>
  );
};

export default VariantImageGallery;
