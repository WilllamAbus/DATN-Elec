import React from "react";
import { COLOR  } from "../../../../../../services/detailProduct/types/getDetailProduct"; 

interface ColorSelectorProps {
  colors: COLOR[];
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Màu sắc</h3>
      <div className="mt-2 flex flex-wrap gap-4">
        {colors.length > 0 ? (
          colors.map((color) => (
            <label key={color._id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                id={color._id}
                name="color"
                value={color.name}
                className="hidden peer"
              />
              <div className="flex items-center justify-center w-auto h-auto p-1 text-sm border border-gray-300 rounded-2xl peer-checked:border-primary-700 peer-checked:text-primary-700 peer-checked:bg-customGray space-x-1">
                <p
                  className="flex items-center justify-center w-3 h-3 border border-gray-300 rounded-full peer-checked:border-primary-700"
                  style={{ backgroundColor: color.code }}
                ></p>
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
