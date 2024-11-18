import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { Link } from 'react-router-dom'; // Import Link

interface Variant {
  _id: string;
  variant_name: string;
}

interface DropdownVariantProps {
  variants: Variant[];
  productId: string; // Thêm prop để nhận productId
}

export default function DropdownVariant({ variants, productId }: DropdownVariantProps) {
  const variantCount = variants.length;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">
          {variantCount} Biến thể
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {variantCount > 0 ? (
          <DropdownItem
          textValue="Danh sách sản phẩm biến thể" >
            <Link to={`/admin/list-product-variant/${productId}`}>Danh sách sản phẩm biến thể</Link>
          </DropdownItem>
        ) : (
          <DropdownItem isDisabled>No variants available</DropdownItem> 
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
