import { Tooltip } from "@nextui-org/react";
import { MyButton } from "../../../../../../../common/customs/MyButton"; 

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPageChange: (newPage: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPageChange
}: PaginationControlsProps) {
  return (
    totalPages > 1 && (
      <div className="flex justify-between my-4">
        {hasPrevPage && (
          <Tooltip
            className="capitalize"
            color="primary"
            content="Trở lại"
            showArrow={true}
          >
            <MyButton
              variant="flat"
              size="sm"
              onPress={() => onPageChange(currentPage - 1)}
              className="text-primary-500 bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black ml-2"
            >
              <span>Trở lại</span>
            </MyButton>
          </Tooltip>
        )}
        {hasNextPage && (
          <Tooltip
            className="capitalize"
            color="primary"
            content="Xem tiếp"
            showArrow={true}
          >
            <MyButton
              size="sm"
              variant="flat"
              onPress={() => onPageChange(currentPage + 1)}
              className="text-primary-500 bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black ml-2"
            >
              <span>Tiếp theo</span>
            </MyButton>
          </Tooltip>
        )}
      </div>
    )
  );
}
