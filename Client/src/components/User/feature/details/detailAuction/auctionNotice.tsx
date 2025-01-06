import React from "react";

const AuctionNotice: React.FC = () => {
  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      <p>Sản phẩm đang trong giai đoạn đấu giá. Hãy đảm bảo bạn đặt giá phù hợp!</p>
      <p className="mt-2">
        Mọi thông tin chi tiết, vui lòng liên hệ với chúng tôi để biết thêm thông tin.
      </p>
    </div>
  );
};

export default AuctionNotice;
