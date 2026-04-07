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
  post: {
    icon: icons.post,
    links: links.post,
    label: labels.post,
  },
  supplier: {
    icon: icons.supplier,
    links: links.supplier,
    label: labels.supplier,
  },
  brand: {
    icon: icons.brand,
    links: links.brand,
    label: labels.brand,
  },
  recycleBin: {
    icon: icons.recycleBin,
    links: links.recycleBin,
    label: labels.recycleBin,
  },
  categories: {
    icon: icons.categories,
    links: links.categories,
    label: labels.categories,
  },
  comment: {
    icon: icons.comment,
    links: links.comment,
    label: labels.comment,
  },
  inbound: {
    icon: icons.inbound,
    links: links.inbound,
    label: labels.inbound,
  },

  inboundV2: {
    icon: icons.inboundV2,
    links: links.inboundV2,
    label: labels.inboundV2,
  },
  homeAdmin: {
    icon: icons.homeAdmin,
    links: links.homeAdmin,
    label: labels.homeAdmin,
  },
  orderCart: {
    icon: icons.orderCart,
    links: links.orderCart,
    label: labels.orderCart,
  },
  attribute: {
    icon: icons.attribute,
    links: links.attribute,
    label: labels.attribute,
  },
  auctions: {
    icon: icons.auctions,
    links: links.auctions,
    label: labels.auctions,
  },
};
