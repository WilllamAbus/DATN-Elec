import { Link } from "react-router-dom";
import { icons } from "./icon";
import { labels } from "./label";
import { links } from "./link";

interface NavItemProps {
  type: keyof typeof links;
}

function NavItem({ type }: NavItemProps) {
  const icon = icons[type];
  const link = links[type][0];
  const label = labels[type];

  return (
    <li>
      <Link
        to={link.to}
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        aria-controls="dropdown-auth"
        data-collapse-toggle="dropdown-auth"
      >
        {icon}
        <span className="flex-1 ml-3 text-left whitespace-nowrap" sidebar-toggle-item="">
          {label}
        </span>
      </Link>
    </li>
  );
}

export default NavItem;
