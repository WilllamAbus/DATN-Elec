import React from 'react';
import prodSelOne from '../../assets/images/products/product19.png'

import prodSelTwo from '../../assets/images/products/product19.png'
import prodSelThree from '../../assets/images/products/product19.png'
import prodSelFour from '../../assets/images/products/product19.png'
import { Link } from 'react-router-dom';
const Arrivale : React.FC = () => {
    return (
        <div className="container pb-16">
            <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">Bán chạy</h2>
            <div className="grid grid-cols-4 gap-4">
  {[
    {
      imgSrc: prodSelOne,
      alt: "product 1",
      title: "Quạt tản nhiệt",
      price: "450.000 vnđ",
      oldPrice: "555.900 vnđ",
      rating: 5,
      reviews: 150
    },
    {
      imgSrc: prodSelTwo,
      alt: "product 2",
      title: "Card đồ họa GTX",
      price: "450.000 vnđ",
      oldPrice: "555.900 vnđ",
      rating: 5,
      reviews: 150
    },
    {
      imgSrc: prodSelThree,
      alt: "product 3",
      title: "DRONE",
      price: "450.000 vnđ",
      oldPrice: "555.900 vnđ",
      rating: 5,
      reviews: 150
    },
    {
      imgSrc: prodSelFour,
      alt: "product 4",
      title: "DRONE X",
      price: "450.000 vnđ",
      oldPrice: "555.900 vnđ",
      rating: 5,
      reviews: 150
    }
  ].map((product, index) => (
    <div key={index} className="bg-white shadow rounded overflow-hidden group">
      <div className="relative">
        <Link to="/detailProd">
        <img src={product.imgSrc} alt={product.alt} className="w-full h-auto" />
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
          {/* Optional icons */}
        </div>
        </Link>
      
      </div>
      <div className="pt-4 pb-3 px-4">
        <a href="/detailProd">
          <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">{product.title}</h4>
        </a>
        <div className="flex items-baseline mb-1 space-x-2">
          <p className="text-xl text-primary font-semibold">{product.price}</p>
          <p className="text-sm text-gray-400 line-through">{product.oldPrice}</p>
        </div>
        <div className="flex items-center">
          <div className="flex gap-1 text-sm text-yellow-400">
            {Array.from({ length: product.rating }, (_, i) => (
              <span key={i}><i className="fa-solid fa-star"></i></span>
            ))}
          </div>
          <div className="text-xs text-gray-500 ml-3">({product.reviews})</div>
        </div>
      </div>
      <a href="/cart" className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition">
       Thêm giỏ hàng
      </a>
    </div>
  ))}
</div>

        </div>
    );
};

export default Arrivale;
