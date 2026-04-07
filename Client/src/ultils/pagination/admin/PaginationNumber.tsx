
"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./css/pagination.module.css";

interface PaginationNumberProps {
  page: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationNumber: FC<PaginationNumberProps> = ({ page, currentPage, onPageChange }) => (
  <li>
    <button
      onClick={() => onPageChange(page)}
      className={clsx(styles.pageNumberButton, {
        [styles.currentPage]: currentPage === page,
        [styles.otherPage]: currentPage !== page,
      })}
    >
      {page}
    </button>
  </li>
);

export default PaginationNumber;
