import React from "react";
import { Alert } from "@nextui-org/react";
import { motion } from "framer-motion";

const AlerWaringAuction: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <div className="flex items-center justify-center w-full mb-3 mt-2">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Alert
            color="warning"
            description="Lý do hủy đơn trúng đấu giá là do hết thời gian mà bạn không bấm xác nhận nên hệ thống ghi nhận và tự động hủy đơn trúng đấu giá của bạn."
            title="Thông báo"
            variant="faded"
          />
        </motion.div>
      )}
    </div>
  );
};

export default AlerWaringAuction;
