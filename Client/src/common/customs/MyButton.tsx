import { extendVariants, Button } from "@nextui-org/react";


export const MyButton = extendVariants(Button, {
  variants: {
    color: {
      olive: "text-[#ffffff] bg-[#84cc16]",
      orange: "bg-[#ff8c00] text-[#fff]",
      violet: "bg-[#8b5cf6] text-[#fff]",
      danger: "text-[#ffffff] bg-[#c20e4d]",
    },
    size: {
      xs: "px-2 min-w-12 h-6 text-tiny gap-1 rounded-small",
      md: "px-4 min-w-20 h-10 text-small gap-2 rounded-small",
      xl: "px-8 min-w-28 h-14 text-large gap-4 rounded-medium",
    },
    variant: {
      bordered: "border-2 border-solid border-current text-current bg-transparent",
      gradient: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white",
      elevated: "shadow-lg bg-[#f0f0f0] text-black",
      danger: "shadow-lg text-[#ffffff] bg-[#c20e4d]",
    },
  },
  defaultVariants: {
    color: "olive",
    size: "xl",
    variant: "bordered",
  },
});

// Extend props for 'as' and 'to'
type MyButtonProps = React.ComponentProps<typeof MyButton> & {
  as?: React.ElementType;
  to?: string;
};

export const CustomMyButton: React.FC<MyButtonProps> = (props) => <MyButton {...props} />;
