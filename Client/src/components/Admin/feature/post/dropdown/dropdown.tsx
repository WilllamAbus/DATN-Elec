import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { EditDocumentIcon } from "../../../../../common/Icons/EditDocumentIcon";
import { useDispatch } from "react-redux"; 
import { handlesoftDeleteCategoryPost } from "../handlers/softDelete"; 
import { AppDispatch } from "../../../../../redux/store"; 
import { DeleteIcon } from "../../../../../common/Icons/DeleteIcon";

interface DropdownCRUDProps {
  categoryId: string;
  currentPage: number; 
  searchTerm: string; 
}

export default function DropdownCRUD({ categoryId, currentPage, searchTerm }: DropdownCRUDProps) {
  const dispatch: AppDispatch = useDispatch(); 
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Tùy chọn</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new"
          startContent={<EditDocumentIcon className={iconClasses} />}
        >
          <Link to={`#`}>
            Sửa danh mục
          </Link>
        </DropdownItem>

        <DropdownItem key="delete" className="text-danger" color="danger"
         startContent={<DeleteIcon className={iconClasses} />}
          onClick={() => handlesoftDeleteCategoryPost(categoryId, dispatch, currentPage, searchTerm)} 
        >
          Xóa danh mục
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
