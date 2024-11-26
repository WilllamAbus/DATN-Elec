import * as React from "react";


export const IconLucideComponent = ({
  height = "1em",
  strokeWidth = "2",
  fill = "none",
  focusable = "false",
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={height}
    focusable={focusable}
    {...props}
  >
    <path
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M5.5 8.5L9 12l-3.5 3.5L2 12zM12 2l3.5 3.5L12 9L8.5 5.5zm6.5 6.5L22 12l-3.5 3.5L15 12zM12 15l3.5 3.5L12 22l-3.5-3.5z"
    />
  </svg>
);
