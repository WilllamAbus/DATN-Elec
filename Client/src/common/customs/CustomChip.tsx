import { extendVariants, Chip } from "@nextui-org/react";

const CustomChip = extendVariants(Chip, {
  variants: {
    color: {
      springGreen: {
        base: "text-[#ffffff] bg-[#1bc24e]", 
      },
      olive: {
        base: "text-[#ffffff] bg-[#84cc16]", 
      },
      orange: {
        base: "bg-[#ff8c00] text-[#fff]", 
      },
      violet: {
        base: "bg-[#8b5cf6] text-[#fff]", 
      },
      custom: {
        base: "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md", 
      },
    },
  },
  defaultVariants: {
    color: "custom", 
  },
});

export default CustomChip;
