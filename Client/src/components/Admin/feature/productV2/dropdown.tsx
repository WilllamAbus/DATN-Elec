import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { EditDocumentIcon } from "../../../../common/Icons/EditDocumentIcon";
import { AddNoteIcon } from "../../../../common/Icons/AddNoteIcon";
import { useDispatch } from "react-redux"; 
import { handleSoftDeleteProduct } from "./handlers/softDelete"; 
import { AppDispatch } from "../../../../redux/store"; 
import { DeleteIcon } from "../../../../common/Icons/DeleteIcon";

interface DropdownCRUDProps {
  productId: string;
  currentPage: number; 
  searchTerm: string; 
}

export default function DropdownCRUD({ productId, currentPage, searchTerm }: DropdownCRUDProps) {
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
          textValue="Sửa sản phẩm" 
        >
          <Link to={`/admin/editproduct/${productId}`}>
            Sửa sản phẩm
          </Link>
        </DropdownItem>
        <DropdownItem key="copy"
          startContent={<AddNoteIcon className={iconClasses} />}
          textValue="Thêm biến thể" 
        >
          
          <Link to={`/admin/product/${productId}/addvariant`}>
            Thêm biến thể
          </Link>
        </DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger"
         startContent={<DeleteIcon className={iconClasses} />}
         textValue="Xóa sản phẩm"
          onClick={() => handleSoftDeleteProduct(productId, dispatch, currentPage, searchTerm)} 
        >
          Xóa sản phẩm
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
