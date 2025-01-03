// export interface CartItem {
//   _id: string;
//   product: {
//     _id: string;
//     product_name: string;
//     product_description: string;
//     product_type: string;
//     createdAt: string;
//     product_discount: number;
//     product_supplier: string;
//     product_brand: string;
//     product_format: string;
//     product_condition: string;
//     product_quantity: number;
//     product_price: number;
//     product_price_unit: number;
//     product_attributes: { k: string; v: string }[];
//     weight_g: number;
//     image: string[];
//   };
//   quantity: number;
//   price: number;
//   totalItemPrice: number;
//   isSelected?: boolean;
//   inventory: {
//     _id: string;
//     product: string;
//     quantityShelf: number;
//     quantityStock: number;
//     totalQuantity: number;
//     supplier: string;
//     price: number;
//     totalPrice: number;
//     status: string;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
//   };
// }

// export interface CartType {
//   _id: string;
//   user: {
//     _id: string;
//     name: string;
//     email: string;
//     address: string;
//     phone: string;
//   };
//   items: CartItem[];
//   totalPrice: number;
//   stateNotifi: string;
//   isActive: boolean;
//   status: string;
//   disabledAt: string | null;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }
import { ProductAuction } from "../../services/detailProductAuction/types/detailAuction";
export interface CartItem {
  _id: string;
  product: {
    _id: string;
    product_name: string;
    product_description: string;
    sku: string;
    pid: string;
    product_type: string;
    hasVariants: string;
    product_brand: string;
    product_format: string;
    product_condition: string;
    product_supplier: string;
    product_ratingAvg: number;
    product_view: number;
    product_price: number;
    product_price_unit: number;
    weight_g: number;
    isActive: boolean;
    status: string;
    disabledAt: string | null;
    variants: string[];
    product_attributes: { k: string; v: string }[];
    createdAt: string;
    updatedAt: string;
    slug: string;
    __v: number;
    image: string[];
    comments: string[];
    product_discount?: {
      discountId: string;
      code: string;
      discountPercent: number;
      isActive: boolean;
      status: string;
      disabledAt: string | null;
    };
  };
  productVariant: ProductVariant;
  quantity: number;
  price: number;
  totalItemPrice: number;
  isSelected?: boolean;
  inventory: {
    _id: string;
    product_variant: ProductVariant;
    quantityShelf: number;
    quantityStock: number;
    totalQuantity: number;
    price: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
export interface auctionWinner {
  _id: string;
  auctionPricingRange: string;
  auctionRound: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  bidPrice: number;
  paymentStatus: string;
  auctionStatus: string;
  status: string;
  auctionStausCheck: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}
export interface AuctionPricingRange {
  _id: string;
  startTime: string;
  endTime: string;
  startingPrice: number;
  maxPrice: number;
  currentPrice: number;
  priceStep: number;
  status: string;
  product_randBib: ProductAuction;
  createdAt: string;
  updatedAt: string;
  auctionPriceHistory: string;
}

export interface AuctionRound {
  _id: string;
  auctionPricing: string;
  participants: string[];
  bids: {
    user: string;
    bidPrice: number;
    bidTime: string;
    _id: string;
  }[];
  status: string;
  createdAt: string;
  updatedAt: string;
}
export interface itemAuction {
  auctionWinner: auctionWinner;
  auctionStartTime: string;
  auctionEndTime: string;
  quantity: number;
  price: number;
  totalItemPrice: number;
  isSelected: boolean;
  inventory: string | null;
  auctionPricingRange: AuctionPricingRange;
  auctionRound: AuctionRound;
  _id: string;
}
export interface CartType {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  items: CartItem[];
  itemAuction: itemAuction[];
  totalPrice: number;
  stateNotifi: string;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface ProductVariant {
  _id: string;
  variant_name: string;
  variant_price: number;
  ram: Ram | null;
  color?: Color[] | null;
  cpu?: Cpu | null;
  graphicsCard?: string | null;
  battery?: Battery | null;
  operatingSystem?: OperatingSystem | null;
  screen?: Screen | null;
  storage?: Storage | null;
  image: ImageVariant[];
  sku: string;
  status: "active" | "inactive";
  product: string;
  inventory: string[];
}

export interface ImageVariant {
  _id: string;
  image: string[];
  productVariant: string;
  color: string;

  slug: string;
}

export interface Battery {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;

  slug: string;
}

export interface Color {
  _id: string;
  name: string;
  code: string;
  status: string;
  sku: string;
  pid: string;

  slug: string;
}

export interface Cpu {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;

  slug: string;
}

export interface OperatingSystem {
  _id: string;
  name: string;
  version: string;
  status: string;
  sku: string;
  pid: string;

  slug: string;
}

export interface Ram {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;

  slug: string;
}

export interface Screen {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;

  slug: string;
}

export interface Storage {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  slug: string;
}
