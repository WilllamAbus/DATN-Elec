import React from "react";
import { motion } from "framer-motion"; 
import { Tooltip } from "@nextui-org/react";
import { Heart } from "../svg";

interface FavoriteButtonProps {
  onClick?: () => void;
}
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ onClick }) => {
  return (
    <Tooltip content="Thêm vào danh sách yêu thích" placement="top">
      <motion.a
        href="#"
        className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-customPink rounded-lg border border-gray-200"
        role="button"
        onClick={onClick}
        whileHover={{ opacity: 0.8 }} 
        transition={{ duration: 0.3 }} 
      >
        <Heart />
        Yêu thích
      </motion.a>
    </Tooltip>
  );
};

export default FavoriteButton;
