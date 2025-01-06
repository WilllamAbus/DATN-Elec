import React from "react";
import { Alert } from "@nextui-org/react";
import { motion } from "framer-motion";

interface AlertCheckStatusCartProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const AlertCheckStatusCart: React.FC<AlertCheckStatusCartProps> = ({ visible, setVisible }) => {
  return (
    <div className="pl-8 pr-8 items-center justify-center w-full mb-3 mt-2">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Alert
            color="warning"
            description="Vui lòng thanh toán để được đấu giá tiếp tục"
            title="Thông báo"
            variant="faded"
            onClose={() => setVisible(false)}
          />
        </motion.div>
      )}
    </div>
  );
};

export default AlertCheckStatusCart;
