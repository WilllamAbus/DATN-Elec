import { useState } from "react";

export const useImageUpload = () => {
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null); 

    if (file) {
        const fileSizeMB = file.size / 10000 / 10000;
        const fileType = file.type;

        console.log("File Size (MB):", fileSizeMB);
        console.log("File Type:", fileType);

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
        setImgPreview(null);
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
