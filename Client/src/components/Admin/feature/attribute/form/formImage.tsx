import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { Post } from "../../../../../services/post/admin/types/post";
import { Progress,Spinner,Tooltip} from "@nextui-org/react";
import { DeleteIcon } from "../../../../../common/Icons/DeleteIcon";

interface ImageUploadProps {
  imgPreview: string | null;
  register: UseFormRegister<Post>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  validation?: {
    required?: string;
  };
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  imgPreview,
  register,
  handleImageChange,
  error,
  validation,
}) => {

  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false); 
    const totalSize = file.size;
    let uploadedSize = 0;

    const interval = setInterval(() => {
      uploadedSize += totalSize / 20;
      const progressValue = Math.min((uploadedSize / totalSize) * 100, 100);
      setProgress(progressValue);

      if (progressValue === 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadSuccess(true); 
      }
    }, 100);

    handleImageChange(e);
  };

  const handleDeleteImage = () => {
    setShowSpinner(true);

    setTimeout(() => {
      setUploadSuccess(false);
      setProgress(0);
      handleImageChange({ target: { files: null } } as any);

      const fileInput = document.getElementById("thumbnail") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      setShowSpinner(false);
    }, 3000); 
  };
  


  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
      {imgPreview && (
          <div className="flex items-center mb-4">
            <div className="relative w-24 h-24 overflow-hidden rounded-lg">
              <img
                src={imgPreview}
                alt="Image Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <Tooltip content="Xóa ảnh">
              <button
                type="button"
                className="ml-2 p-1 text-danger-600 rounded-full shadow-md hover:text-danger-500"
                onClick={handleDeleteImage}
              >
                {showSpinner ? (
                  <Spinner size="sm" color="danger" />
                ) : (
                  <DeleteIcon />
                )}
              </button>
            </Tooltip>
          </div>
        )}


        <div>
          <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
            Hình ảnh
          </h3>
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {!error && "JPG, GIF hoặc PNG. Max size là 800KB"}
            {error && <span className="text-red-600">{error}</span>}
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="file"
              multiple
              id="thumbnail"
              {...register("thumbnail", validation)}
              onChange={handleFileChange}
              className="hiddenblock w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
          </div>

          {/* Hiển thị progress bar với NextUI */}
          {isUploading && (
            <div className="mt-4">
              <Progress
                size="sm"
                radius="sm"
                value={progress}
                showValueLabel={true}
                classNames={{
                  base: "max-w-md",
                  track: "drop-shadow-md border border-default",
                  indicator: "bg-gradient-to-r from-blue-500 to-purple-500",
                  label: "tracking-wider font-medium text-default-600",
                  value: "text-foreground/60",
                }}
                label="Uploading"
              />
            </div>
          )}

          {/* Hiển thị thông báo thành công */}
          {uploadSuccess && (
            <p className="text-pastelGreen font-semibold mt-2">
              Tệp được tải lên thành công
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
