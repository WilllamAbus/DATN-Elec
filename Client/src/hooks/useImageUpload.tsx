import { useState } from "react";

export const useImageUpload = () => {
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeMB = file.size / 1024 / 1024;
      const fileType = file.type;

      if (fileSizeMB > 2) {
        setError("Kích thước tệp quá lớn. Tối đa 2MB.");
      } else if (!fileType.startsWith("image/")) {
        setError("Định dạng tệp không hợp lệ. Chỉ chấp nhận hình ảnh.");
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImgPreview(reader.result);
            setError(null);
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      setError("Không có tệp nào được chọn.");
    }
  };

  return {
    imgPreview,
    setImgPreview,
    error,
    handleImageChange,
  };
};
