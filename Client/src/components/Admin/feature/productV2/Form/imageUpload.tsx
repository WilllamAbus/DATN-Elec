import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Product} from "../../../../../services/product_v2/admin/types/add-product";

interface ImageUploadProps {
  imgPreview: string | null;
  register: UseFormRegister<Product>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  imgPreview,
  register,
  handleImageChange,
  error,
}) => (
  <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
    <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
      {imgPreview && (
        <div className="mb-4 rounded-lg w-24 h-24 sm:mb-0 xl:mb-4 2xl:mb-0">
          <img src={imgPreview} alt="Image Preview" />
        </div>
      )}
      <div>
        <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Hình ảnh</h3>
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          JPG, GIF or PNG. Max size of 800KB
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="file"
            multiple
            id="image"
            {...register("image")}
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          {error && <span className="text-red-600">{error}</span>}
        </div>
      </div>
    </div>
  </div>
);

export default ImageUpload;
