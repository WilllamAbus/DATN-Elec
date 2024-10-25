import React, { useState, useEffect } from "react";
import { ProductVariant, STORAGE, FilterState } from "../../../../../../services/detailProduct/types/getDetailProduct";  

interface StorageSelectorProps {
  variants: ProductVariant[];
  onChange?: (selectedStorage: STORAGE) => void; 
  filters: FilterState;
}

const StorageSelector: React.FC<StorageSelectorProps> = ({ variants, onChange = () => {}, filters }) => {
  const [selectedStorage, setSelectedStorage] = useState<STORAGE | null>(null);

  useEffect(() => {
    if (filters.storage && typeof filters.storage !== 'string') {
      setSelectedStorage(filters.storage);  
    } else {
      setSelectedStorage(null);  
    }
  }, [filters.storage]);

  // Tạo một danh sách tất cả các storage từ tất cả các variant
  const allStorageOptions = Array.from(
    new Set(
      variants.flatMap((variant) => variant.storage ? [variant.storage] : [])
    )
  );

  const handleStorageClick = (storage: STORAGE | undefined) => {
    if (storage) { 
      setSelectedStorage(storage);
      if (onChange) {
        onChange(storage);  
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bộ nhớ</h3>
      <div className="mt-2 flex flex-wrap gap-4">
        {allStorageOptions.length > 0 ? (
          allStorageOptions.map((storage) => (
            <label key={storage._id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                id={`capacity-${storage._id}`}
                name="capacity"
                value={storage.name}
                className="hidden peer"
                checked={selectedStorage?._id === storage._id}
                onChange={() => handleStorageClick(storage)}
              />
              <div className="flex items-center justify-center w-auto h-auto p-1 text-sm border border-gray-300 rounded-md peer-checked:border-primary-700 peer-checked:text-primary-700 peer-checked:bg-customGray">
                <p className="font-medium">
                  {storage.name}
                </p>
              </div>
            </label>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Không có tùy chọn dung lượng nào</p>
        )}
      </div>
    </div>
  );
};

export default StorageSelector;
