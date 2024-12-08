import * as React from "react";

export const IconLucideDot: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }> = ({
  size,
  height = "1em",
  strokeWidth = "2",
  fill = "none",
  focusable = "false",
  ...props
}) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={size || height}
    width={size || height}  
    focusable={focusable}
    {...props}
  >
    <circle
      cx="12.1"
      cy="12.1"
      r="1"
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
