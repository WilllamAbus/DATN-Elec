import Dropdown from "./dropdowOpenSidebar";
import { dropdownData } from "./dropdownDataSidebar";

interface DropdownItemProps {
  type: keyof typeof dropdownData;
}

function DropdownItem({ type }: DropdownItemProps) {
  const { icon, links, label } = dropdownData[type];
  
  return <Dropdown icon={icon} label={label} links={links} />;
}

export default DropdownItem;
