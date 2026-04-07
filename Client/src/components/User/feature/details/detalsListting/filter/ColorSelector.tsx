import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { COLOR, FilterState } from "../../../../../../services/detailProduct/types/getDetailProduct";
import { RootState } from "../../../../../../redux/store";

interface ColorSelectorProps {
  filters: FilterState;
  onChange?: (selectedColor: COLOR | null) => void;
  isStorageSelected: boolean; // New prop to control whether storage is selected
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ filters, onChange = () => {}, isStorageSelected }) => {
  const { productDetail } = useSelector((state: RootState) => state.productClient.getProductDetail);

  const colors: COLOR[] = (productDetail?.variants || [])
    .flatMap((variant) => variant.color || [])
    .filter((color): color is COLOR => color !== undefined);

  const initialActiveIndex = Array.isArray(filters.color) && filters.color.length > 0 ? 0 : -1;
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);

  useEffect(() => {
    if (Array.isArray(filters.color) && filters.color.length > 0) {
      setActiveIndex(0);
    }
  }, [filters]);

  const handleColorClick = (index: number) => {
    setActiveIndex(index);
    onChange(colors[index]);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Màu sắc</h3>
      <div className="mt-2 flex flex-wrap gap-4">
        {colors.length > 0 ? (
          colors.map((color, index) => (
            <label
              key={color._id}
              className={`flex items-center cursor-pointer ${isStorageSelected ? '' : 'opacity-50 pointer-events-none'}`}
              onClick={() => isStorageSelected && handleColorClick(index)}
            >
              <input
                type="radio"
                id={color._id}
                name="color"
                value={color.name}
                className="hidden peer"
                checked={activeIndex === index}
                readOnly
              />
              <div className={`flex items-center justify-center w-auto h-auto p-1 text-sm border-[0.2px] rounded-2xl ${activeIndex === index ? 'border-blue-400 text-primary-700 bg-veryPaleBlue' : 'border-gray-300 text-gray-600'}`}>
                <p className="flex items-center justify-center w-3 h-3 border rounded-full" style={{ backgroundColor: color.code }}></p>
                <p className="font-medium">{color.name}</p>
              </div>
            </label>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Không có màu sắc nào</p>
        )}
      </div>
    </div>
  );
};


export default ColorSelector;
