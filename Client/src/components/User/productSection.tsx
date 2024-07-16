import React from "react";
import prodOne from "../../assets/images/products/product2.png";
import prodTwo from "../../assets/images/products/product15.png";
import prodThree from "../../assets/images/products/product12.jpg";
import prodFour from "../../assets/images/products/product12.png";

import prodFive from "../../assets/images/products/product2.png";
import prodSix from "../../assets/images/products/product15.png";
import prodSeven from "../../assets/images/products/product12.jpg";
import prodEight from "../../assets/images/products/product12.png";
import { Link } from "react-router-dom";

const ProductSection: React.FC = () => {
  return (
    <div className="container pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
        Đề xuất cho bạn
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            image: prodOne,
            name: "Asus Tuf Gamming",
            price: "450.000 vnđ",
            originalPrice: "555.900 vnđ",
            rating: 5,
            reviews: 150,
          },
          {
            image: prodTwo,
            name: "QUẠT TẢN NHIỆT",
            price: "450.000 vnđ",
            originalPrice: "555.900 vnđ",
            rating: 5,
            reviews: 150,
          },
          {
            image: prodThree,
            name: "Quạt tản nhiệt",
            price: "450.000 vnđ",
            originalPrice: "555.900 vnđ",
            rating: 5,
            reviews: 150,
          },
          {
            image: prodFour,
            name: "Card đồ họa",
            price: "450.000 vnđ",
            originalPrice: "555.900 vnđ",
            rating: 5,
            reviews: 150,
          },
          {
            image: prodFive,
            name: "Asus Tuf Gamming",
            price: "450.000 vnđ",
            originalPrice: "555.900 vnđ",
            rating: 5,
            reviews: 150,
          },
          {
            image: prodSix,
            name: "Quạt tản nhiệt",
            price: "450.000 vnđ",
            originalPrice: "555.900 vnđ",
            rating: 5,
            reviews: 150,
          },
          {
            image: prodSeven,
            name: "Quạt tản nhiệt",
            price: "450.000 vnđ",
            originalPrice: "555.900 vnđ",
            rating: 5,
            reviews: 150,
          },
          {
            image: prodEight,
            name: "Card đồ họa",
            price: "450.000 vnđ",
            originalPrice: "555.900 vnđ",
            rating: 5,
            reviews: 150,
          },
        ].map((product, index) => (
          <div
            key={index}
            className="bg-white shadow rounded overflow-hidden group"
          >
            <div className="relative">
              <Link to="/detailProd">
                <img
                  src={product.image}
                  alt={`product ${index + 1}`}
                  className="w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition"></div>
              </Link>
            </div>
            <div className="pt-4 pb-3 px-4">
              <a href="/detailProd">
                <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                  {product.name}
                </h4>
              </a>
              <div className="flex items-baseline mb-1 space-x-2">
                <p className="text-xl text-primary font-semibold">
                  {product.price}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {product.originalPrice}
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex gap-1 text-sm text-yellow-400">
                  {[...Array(product.rating)].map((_, i) => (
                    <span key={i}>
                      <i className="fa-solid fa-star"></i>
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 ml-3">
                  ({product.reviews})
                </div>
              </div>
            </div>
            <a
              href=""
              className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition"
            >
              Thêm giỏ hàng
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
