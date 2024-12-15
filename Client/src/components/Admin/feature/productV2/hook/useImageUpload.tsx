import { useState } from "react";

type ImagePreview = {
  id: string;
  url: string;
  progress: number;
  status: string;
};

export const useImageUpload = () => {
  const [imgPreviews, setImgPreviews] = useState<ImagePreview[]>([]);
  const [error, setErrors] = useState<string[]>([]);

  const updateFileInput = (updatedFiles: File[]) => {
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      fileInput.files = dataTransfer.files;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newErrors: string[] = [];
    const newPreviews: ImagePreview[] = [...imgPreviews];

    const validFiles: File[] = [];

    Array.from(files).forEach((file, index) => {
      const fileSizeMB = file.size / (1024 * 1024);
      const fileType = file.type;

      if (fileSizeMB > 2) {
        newErrors.push(`Kích thước tệp "${file.name}" quá lớn. Tối đa 2MB.`);
      } else if (!fileType.startsWith("image/")) {
        newErrors.push(`Định dạng tệp "${file.name}" không hợp lệ.`);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            newPreviews.push({
              id: `${file.name}-${index}`, // Unique ID
              url: reader.result,
              progress: 100, // Default progress
              status: "uploaded", // Default status
            });
            setImgPreviews([...newPreviews]); // Cập nhật lại state
          }
        };
        reader.readAsDataURL(file);
        validFiles.push(file); // Lưu file hợp lệ
      }
    });

    setErrors(newErrors);
    updateFileInput(validFiles);
  };

  const handleRemoveImage = (id: string) => {
    const updatedPreviews = imgPreviews.filter((img) => img.id !== id);
    setImgPreviews(updatedPreviews);

    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      const newFiles = Array.from(fileInput.files || []).filter(
        (file) => `${file.name}-${Array.from(fileInput.files!).indexOf(file)}` !== id
      );
      updateFileInput(newFiles);
    }
  };

  return {
    imgPreviews,
    error,
    handleImageChange,
    handleRemoveImage,
  };
};
