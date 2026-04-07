import { extendVariants, Button } from "@nextui-org/react";

export const MyButton = extendVariants(Button, {
  variants: {
    color: {
      olive: "text-[#ffffff] bg-[#84cc16]",    // Màu xanh lá
      orange: "bg-[#ff8c00] text-[#fff]",       // Màu cam
      violet: "bg-[#8b5cf6] text-[#fff]",       // Màu tím
      danger: "text-[#ffffff] bg-[#c20e4d]",    // Màu đỏ
      customGreen: "text-[#ffffff] bg-[#2d6a4f]", // Màu xanh lá tùy chỉnh
      customBlue: "text-[#ffffff] bg-[#0077b6]",  // Màu xanh dương tùy chỉnh
      price: "text-[#ffffff] bg-[#3b9f82]", // Màu xanh lá dễ chịu cho giá tiền
    },
    size: {
      xs: "px-2 min-w-12 h-6 text-tiny gap-1 rounded-small",
      md: "px-4 min-w-20 h-10 text-small gap-2 rounded-small",
      xl: "px-8 min-w-28 h-14 text-large gap-4 rounded-medium",
    },
    variant: {
      bordered: "border-2 border-solid border-current text-current bg-transparent",
      gradient: "bg-gradient-to-r from-[#5BA8A0] to-[#CBE5AE] text-white font-bold",
      gradientBlue: "bg-gradient-to-r from-[#015C92] to-[#2D82B5] text-white font-bold", 
      elevated: "shadow-lg bg-[#f0f0f0] text-black",
      danger: "shadow-lg text-[#ffffff] bg-[#c20e4d]",
      customShadow: "shadow-2xl bg-[#e5e7eb] text-black", // Shadow tùy chỉnh
      solid: "bg-[#3490dc] text-white", // Màu nền đặc biệt
      outlined: "border-2 border-[#3490dc] text-[#3490dc] bg-transparent", // Viền với màu xanh dương
      neon: "bg-[#2bd4b0] text-white shadow-lg border-2 border-[#00df9a]", // Neon xanh lá
      transparent: "bg-transparent text-[#3b9f82] bg-[#3b9f82] font-bold", // Màu nền trong suốt
      confirmSolid: "bg-gradient-to-r from-[#015C92] to-[#2D82B5] text-white font-bold", // Gradient xanh dương cho nút xác nhận
      cancelSolid: "bg-gradient-to-r from-[#C73866] to-[#FE676E] text-white font-bold", // Gradient đỏ cho nút hủy
      waitSolid: "bg-gradient-to-r from-[#F9D423] to-[#FF4E50] text-white font-bold",
      cancelSolidTemporary: "bg-gradient-to-r from-[#FF5733] to-[#FF8D1A] text-white font-bold",
      confirmSolidTemporary: "bg-gradient-to-r from-[#FF5733] to-[#FF8D1A] text-white font-bold",
    },
  },
  defaultVariants: {
    color: "olive",     // Mặc định là màu xanh lá
    size: "xl",         // Kích thước mặc định là xl
    variant: "bordered",// Biến thể mặc định là bordered
  },
});

// Extend props for 'as' and 'to'
type MyButtonProps = React.ComponentProps<typeof MyButton> & {
  as?: React.ElementType;
  to?: string;
};

export const CustomMyButton: React.FC<MyButtonProps> = (props) => <MyButton {...props} />;
