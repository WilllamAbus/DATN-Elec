import * as React from "react";



export const IconMdiStickerAlert = ({
  size,
  height = "1em",
  fill = "#ffffff",
  focusable = "false",
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children"> & { size?: string | number }) => (
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
      d="M11 15.5h2v2h-2zm3 3.5v-.4H5.4L12 7.3l4.11 7.14c.51-.44 1.09-.79 1.73-1.03L12 3.3L2 20.6h12.22c-.14-.51-.22-1.04-.22-1.6m-1-8.5h-2v4h2zm6 4.5v3h-3v2h3v3h2v-3h3v-2h-3v-3z"
    />
  </svg>
);
