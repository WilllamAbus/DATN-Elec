import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const Filter: React.FC = () => {
    const [selectedPrice, setSelectedPrice] = useState<string>('all');
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const pathParts = location.pathname.split('/');
      const priceParam = pathParts[pathParts.length - 1];
      
      if (priceParam === 'allList') {
        setSelectedPrice('all');
      } else {
        setSelectedPrice(priceParam);
      }
    }, [location.pathname]);
  
    const handleCheckPrice = (e: ChangeEvent<HTMLInputElement>) => {
      const price = e.target.value;
      if (price === 'all') {
        navigate(`/allList`); 
      } else {
        setSelectedPrice(price); 
        navigate(`/filter/${price}`); 
      }
    };
    const filterPrice = [
      { value: "all",name:"price", id: "price-all", title: "Tất cả sản phẩm" },
      { value: "price-0",name:"price", id: "price-0", title: "Dưới 500.000 VNĐ" },
      { value: "price-1",name:"price", id: "price-1", title: "500.000 VNĐ - 1.000.000 VNĐ" },
      { value: "price-2",name:"price", id: "price-2", title: "1.000.000 VNĐ - 3.000.000 VNĐ" },
      { value: "price-3",name:"price", id: "price-3", title: "3.000.000 VNĐ - 5.000.000 VNĐ" },
      { value: "price-4",name:"price", id: "price-4", title: "Trên 5.000.000 VNĐ" },

    ];
  return (
    <>
      <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
        Giá
      </h3>
      <div className="space-y-2">
        {filterPrice.map((price)=>(
          <div className="flex items-center">
          <input
            type="radio"
            name={price.name}
            value={price.value}
            id={price.id}
            checked={selectedPrice === price.value}
            onChange={handleCheckPrice}
          />
          <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="price-all">
          {price.title}
          </label>
        </div>
        ))}
      </div>
    </>
  );
}

export default Filter;
