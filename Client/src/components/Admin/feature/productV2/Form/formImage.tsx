import React, { useEffect } from "react";
import { UseFormRegister } from "react-hook-form";
import { ImageVariant } from "../../../../../services/product_v2/admin/types/imageVariant";
import { Progress, Tooltip } from "@nextui-org/react";
import { DeleteIcon } from "../../../../../common/Icons/DeleteIcon";

interface ImageUploadProps {
  imgPreviews: { id: string; url: string; progress: number; status: string }[];
  register: UseFormRegister<ImageVariant>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string;
  validation?: {
    required?: string;
  };
  onImageRemove?: (id: string) => void; 
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  imgPreviews,
  register,
  errors,
  validation,
  onImageRemove, 
}) => {
  const [uploads, setUploads] = React.useState(
    imgPreviews.map((img) => ({ ...img, progress: 0, status: "" }))
  );

  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  
  useEffect(() => {
    // Cập nhật lại danh sách `uploads` khi `imgPreviews` thay đổi
    setUploads(imgPreviews.map((img) => ({ ...img, progress: 0, status: "" })));
  }, [imgPreviews]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; 
    if (!files || files.length === 0) return;
  
    const newFiles = Array.from(files).filter(
      (file) => !selectedFiles.some((selected) => selected.name === file.name)
    );
  
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  
    const newUploads = newFiles.map((file) => ({
      id: file.name,
      url: URL.createObjectURL(file),
      progress: 0,
      status: "Uploading",
    }));
  
    setUploads((prev) => [...prev, ...newUploads]);
    await Promise.all(newUploads.map((file) => uploadFile(file)));
  };

  const handleRemoveImage = (id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
    setSelectedFiles((prev) => prev.filter((file) => file.name !== id));
    
    updateFileInput(id);
    
    if (onImageRemove) {
      onImageRemove(id);
    }
  };

  const updateFileInput = (id: string) => {
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      const newFiles = Array.from(fileInput.files || []).filter(
        (file) => file.name !== id
      );
      const dataTransfer = new DataTransfer();
      newFiles.forEach((file) => dataTransfer.items.add(file));
      fileInput.files = dataTransfer.files;
    }
  };

  const uploadFile = async (file: { id: string; url: string }) => {
    const totalSize = 100;
    let uploadedSize = 0;
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        uploadedSize += totalSize / 20;
        const progressValue = Math.min((uploadedSize / totalSize) * 100, 100);

        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === file.id
              ? { ...upload, progress: progressValue, status: progressValue === 100 ? "Uploaded" : "Uploading" }
              : upload
          )
        );

        if (progressValue === 100) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  };

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Hình ảnh</h3>
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {!errors && "JPG, GIF hoặc PNG. Max size là 800KB"}
        {errors && <span className="text-red-600">{errors}</span>}
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          multiple
          id="image"
          {...register("image", validation)}
          onChange={handleFileChange}
          className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>
      <div className="mt-4 space-y-4">
        {uploads.map((upload) => (
          <div key={upload.id} className="flex items-center p-2 bg-gray-100 rounded-lg shadow-sm dark:bg-gray-700">
            <div className="relative w-24 h-24 overflow-hidden rounded-lg">
              <img src={upload.url} alt="Preview" className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 ml-4">
              {upload.status === "Uploading" && (
                <Progress
                  size="sm"
                  radius="sm"
                  value={upload.progress}
                  classNames={{
                    base: "max-w-md",
                    track: "border",
                    indicator: "bg-gradient-to-r from-blue-500 to-purple-500",
                  }}
                  label="Đang tải"
                />
              )}
              {upload.status === "Uploaded" && (
                <p className="text-[#53c277] font-semibold">Tải lên thành công</p>
              )}
            </div>
            <Tooltip content="Xóa ảnh">
              <button
                type="button"
                className="ml-2 text-danger-600 p-1 rounded-full shadow-md hover:text-danger-500"
                onClick={() => handleRemoveImage(upload.id)}
              >
                <DeleteIcon />
              </button>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
