import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { EditDocumentIcon } from "../../../../common/Icons/EditDocumentIcon";
import { AddNoteIcon } from "../../../../common/Icons/AddNoteIcon";
interface DropdownCRUDProps {
  productId: string;
}
export default function DropdownCRUD({ productId }: DropdownCRUDProps) {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
        >
          Tùy chọn
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new"
          startContent={<EditDocumentIcon className={iconClasses} />}
        > <Link
          to={`/admin/editproduct/${productId}`}
        >
            Sửa sản phẩm
          </Link>
          </DropdownItem>
         <DropdownItem key="copy"
          startContent={<AddNoteIcon className={iconClasses} />}
         >   
           <Link
          to={`/admin/product/${productId}/addvariant`}
        >
          Thêm biến thể
        </Link></DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}