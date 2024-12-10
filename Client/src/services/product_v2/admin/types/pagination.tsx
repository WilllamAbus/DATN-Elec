export interface Variant {
  _id: string;
  variant_name: string;
  variant_price: number;
  battery: {
    _id: string;
    name: string;
    status: string;
    sku: string;
    pid: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
  };
  color: {
    _id: string;
    name: string;
    code: string;
    status: string;
    sku: string;
    pid: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
  }[];
  cpu: {
    _id: string;
    name: string;
    status: string;
    sku: string;
    pid: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
  };
  operatingSystem: {
    _id: string;
    name: string;
    version: string;
    status: string;
    sku: string;
    pid: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
  };
  ram: {
    _id: string;
    name: string;
    status: string;
    sku: string;
    pid: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
  };
  screen: {
    _id: string;
    name: string;
    status: string;
    sku: string;
    pid: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
  };
  storage: {
    _id: string;
    name: string;
    status: string;
    sku: string;
    pid: string;
    slug: string;
  };
  image: string[];
  sku: string;
  pid: string;
  status: string;
  product_id: string; 
  createdAt: string;
  updatedAt: string;
  slug: string;
  inventory: {
    _id: string;
    quantityShelf: number;
    quantityStock: number;
    totalQuantity: number;
    price: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface Product {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: { name: string; imgURL: string };
  createdAt: string;
  product_discount: number;
  product_supplier: string;
  product_brand: string;
  product_format: string;
  product_condition: string;
  product_quantity: number;
  product_price: number;
  product_attributes: { k: string; v: string }[];
  weight_g: number;
  image: string[];
  status: string;
  variantCount: number; 
  variants: Variant[]; 
  hasVariants:boolean;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LimitCrudProductResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    products: Product[];
    variants: Variant[]; 
  };
  pagination: Pagination;
}

export interface LimitDeletedListResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    products: Product[];
  };
  pagination: Pagination;
}
