// PaginationComponent.tsx
"use client";

import PaginationButton from "./PaginationButton";
import PaginationNumber from "./PaginationNumber";
import { FC } from "react";
import styles from "./css/pagination.module.css";
import { arrowLeft, arrowRight } from './iconPaths';

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.navContainer} aria-label="Table navigation">
      <ul className={styles.paginationList}>
        <li>
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.roundedLeft}
            ariaLabel="Previous"
            iconPath={arrowLeft}
          />
        </li>

        {pages.map((page) => (
          <PaginationNumber
            key={page}
            page={page}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        ))}

        <li>
          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.roundedRight}
            ariaLabel="Next"
            iconPath={arrowRight}
          />
        </li>
      </ul>
    </nav>
  );
};

export default PaginationComponent;
