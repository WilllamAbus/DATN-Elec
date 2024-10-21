import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

interface Variant {
  _id: string;
  variant_name: string;
}

interface DropdownVariantProps {
  variants: Variant[];
}

export default function DropdownVariant({ variants }: DropdownVariantProps) {
  const variantCount = variants.length;
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">
        {variantCount} Biến thể
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {variants.length > 0 ? (
          variants.map((variant) => (
            <DropdownItem key={variant._id}>
              {variant.variant_name}
            </DropdownItem>
          ))
        ) : (
          <DropdownItem isDisabled>No variants available</DropdownItem> 
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
