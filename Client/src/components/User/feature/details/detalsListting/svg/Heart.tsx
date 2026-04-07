import React from "react";

interface HeartProps {
  fill?: string;
  size?: string | number;
}

const Heart: React.FC<HeartProps> = ({ fill = "currentColor", size = 24 }) => {
  return (
    <svg
      className="w-5 h-5 -ms-2 me-2"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke={fill} // sử dụng prop fill cho stroke
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
      />
    </svg>
  );
};

export default Heart;
