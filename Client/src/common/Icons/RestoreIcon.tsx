import * as React from "react";

export const RestoreIcon = ({
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
    <g
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M3.06 13a9 9 0 1 0 .49-4.087" />
      <path d="M3 4.001v5h5M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0" />
    </g>
  </svg>
);
