import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/rootReducer";
import { NavItem } from "../types/listcatenav";

const cateDropdownItems = () => {
  const cateClients = useSelector(
    (state: RootState) => state.cateClients.listCateNav.navItems || []
  );
  const dropdownItems = (cateClients || []).map((item: NavItem) => ({
    label: item.name,
    href: `/category/${item.slug}`,
  }));
  

  return dropdownItems;
};

export default cateDropdownItems;
