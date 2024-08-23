
import { icons } from "./icon";
import { labels } from "./label";
import { links } from "./link";

interface DropdownData {
  icon: React.ReactNode;
  links: { label: string; to: string }[];
  label: string;
}

export const dropdownData: Record<string, DropdownData> = {
  account: {
    icon: icons.account,
    links: links.account,
    label: labels.account,
  },
  product: {
    icon: icons.product,
    links: links.product,
    label: labels.product,
  },
  recycleBin: {
    icon: icons.recycleBin,
    links: links.recycleBin,
    label: labels.recycleBin,
  },
};
