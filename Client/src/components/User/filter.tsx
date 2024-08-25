import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const Filter: React.FC = () => {
    const [selectedPrice, setSelectedPrice] = useState<string>('all');
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      // Extract the price parameter from the URL
      const pathParts = location.pathname.split('/');
      const priceParam = pathParts[pathParts.length - 1];
      
      // Update state based on URL path
      if (priceParam === 'allList') {
        setSelectedPrice('all');
      } else {
        setSelectedPrice(priceParam);
      }
    }, [location.pathname]);
  
    const handleCheckPrice = (e: ChangeEvent<HTMLInputElement>) => {
      const price = e.target.value;
  
      if (price === 'all') {
        navigate(`/allList`); // Navigate to the allList page
      } else {
        setSelectedPrice(price); // Update the selected value
        navigate(`/filter/${price}`); // Navigate to the filtered URL
      }
    };

  return (
    <>
      <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
        Giá
      </h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="radio"
            name="price"
            value="all"
            id="price-all"
            checked={selectedPrice === 'all'}
            onChange={handleCheckPrice}
          />
          <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="price-all">
            Tất cả sản phẩm
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            name="price"
            value="price-0"
            id="price-0"
            checked={selectedPrice === 'price-0'}
            onChange={handleCheckPrice}
          />
          <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="price-0">
            Dưới 500.000 VNĐ
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            name="price"
            value="price-1"
            id="price-1"
            checked={selectedPrice === 'price-1'}
            onChange={handleCheckPrice}
          />
          <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="price-1">
            500.000 VNĐ - 1.000.000 VNĐ
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            name="price"
            value="price-2"
            id="price-2"
            checked={selectedPrice === 'price-2'}
            onChange={handleCheckPrice}
          />
          <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="price-2">
            1.000.000 VNĐ - 3.000.000 VNĐ
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            name="price"
            value="price-3"
            id="price-3"
            checked={selectedPrice === 'price-3'}
            onChange={handleCheckPrice}
          />
          <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="price-3">
            3.000.000 VNĐ - 5.000.000 VNĐ
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            name="price"
            value="price-4"
            id="price-4"
            checked={selectedPrice === 'price-4'}
            onChange={handleCheckPrice}
          />
          <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="price-4">
            Trên 5.000.000 VNĐ
          </label>
        </div>
      </div>
    </>
  );
}

export default Filter;
