import clsx from "clsx";
import { FC } from "react";
import { Icon } from "./icon";
import styles from "./css/pagination.module.css";

interface PaginationButtonProps {
  onClick: () => void;
  disabled: boolean;
  className: string;
  ariaLabel: string;
  iconPath: string;
}

const PaginationButton: FC<PaginationButtonProps> = ({
  onClick,
  disabled,
  className,
  ariaLabel,
  iconPath,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={clsx(styles.paginationButton, className, {
      "opacity-50 cursor-not-allowed": disabled,
    })}
    aria-label={ariaLabel}
  >
    <span className="sr-only">{ariaLabel}</span>
    <Icon path={iconPath} ariaLabel={ariaLabel} />
  </button>
);

export default PaginationButton;
