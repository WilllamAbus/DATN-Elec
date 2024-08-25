// icon.tsx
import { FC } from "react";

interface IconProps {
  path: string;
  ariaLabel: string;
}

export const Icon: FC<IconProps> = ({ path, ariaLabel }) => (
  <svg
    className="w-5 h-5"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={ariaLabel}
  >
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);
