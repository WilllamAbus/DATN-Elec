import React from "react";
import { Cart } from "../svg";
import { motion } from "framer-motion"; 
import { Tooltip } from "@nextui-org/react";
interface AddToCartButtonProps {
  onClick?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ onClick }) => {
  return (
    <Tooltip content="Thêm vào danh giỏ hàng của bạn" placement="top">
      <motion.a
      href="#"
      title=""
      className="text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center"
      role="button"
      onClick={onClick}
      whileHover={{ opacity: 0.8 }} 
      transition={{ duration: 0.3 }} 
    >
      <Cart />
      Thêm vào giỏ
      </motion.a>
    </Tooltip>
  );
};

export default AddToCartButton;
