// types.ts

export interface Battery {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface Color {
  _id: string;
  name: string;
  code: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface CPU {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface OperatingSystem {
  _id: string;
  name: string;
  version: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface RAM {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface Screen {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface Storage {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface Inventory {
  quantityShelf: number;
  quantityStock: number;
  totalQuantity: number;
  price: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
export interface Image {
  _id: string;
  image: string[]; 
  color: string; 
}
export interface Variant {
  _id: string;
  variant_name: string;
  variant_price: number;
  battery: Battery;
  color: Color[];
  image: Image[];
  cpu: CPU;
  graphicsCard: string;
  operatingSystem: OperatingSystem;
  ram: RAM;
  screen: Screen;
  storage: Storage;
  sku: string;
  inventory: Inventory;
}
export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export interface VariantsResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    productCountOnPage: number;
    variants: Variant[];
    currentPage: number;
    limit: number;
  };
  pagination: Pagination;
}


