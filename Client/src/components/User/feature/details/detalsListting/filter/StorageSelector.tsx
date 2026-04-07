import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { STORAGE, FilterState } from "../../../../../../services/detailProduct/types/getDetailProduct";  
import { getAllStorageBySlugUrlThunk } from "../../../../../../redux/product/client/Thunk";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../../redux/store";

interface StorageSelectorProps {
  filters: FilterState;  
  onChange?: (selectedStorage: STORAGE | null) => void; 
}

const StorageSelector: React.FC<StorageSelectorProps> = ({ onChange = () => {} }) => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedStorage, setSelectedStorage] = useState<STORAGE | null>(null);
  const [allStorageOptions, setAllStorageOptions] = useState<STORAGE[]>([]);
  const dispatch: AppDispatch = useDispatch();


  useEffect(() => {
    if (slug) { 
      dispatch(getAllStorageBySlugUrlThunk({ slug })).then((result) => {
        console.log("Dữ liệu trả về từ API:", result.payload); 
        if (result.payload && typeof result.payload === "object" && "data" in result.payload) {
          const { data } = result.payload;
          if (Array.isArray(data)) {
            setAllStorageOptions(data); 
          } else {
            console.error("Dữ liệu trả về không phải là mảng STORAGE");
          }
        } else {
          console.error("Dữ liệu trả về không phải là GetAllStorageBySlugUrlResponse");
        }
      });
    }
  }, [slug, dispatch]);

  const handleStorageClick = (storage: STORAGE | undefined) => {
    if (storage) { 
      setSelectedStorage(storage);
      onChange(storage);  
    }
  };

  return (
    allStorageOptions.length > 0 && (  // Kiểm tra có tùy chọn dung lượng hay không
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bộ nhớ</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          {allStorageOptions.map((storage) => (
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
                <p className="font-medium">{storage.name}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    )
  );
};

export default StorageSelector;
