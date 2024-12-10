import * as React from "react";



export const IconRadixIconsDotFilled: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }> = ({
  size,
  height = "1em",
  fill = "currentColor",
  focusable = "false",
  ...props
}) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15 15"
    height={size || height}
    width={size || height}
    focusable={focusable}
    {...props}
  >
    <path
      fill={fill}
      d="M9.875 7.5a2.375 2.375 0 1 1-4.75 0a2.375 2.375 0 0 1 4.75 0"
    />
  </svg>
);
