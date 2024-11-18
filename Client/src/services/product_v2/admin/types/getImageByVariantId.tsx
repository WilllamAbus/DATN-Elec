export interface ImageResponse {
  err: number;
  success: boolean;
  msg: string;
  status: number;
  data: {
    total: number;
    images: Image[];
    imageCountOnPage: number;
  };
  pagination: Pagination;
}

export interface Image {
  _id: string;
  image: string[];  
  productVariant: ProductVariant;
  color: Color;
  price: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
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
export interface ProductVariant {
  _id: string;
  variant_name: string;                                
}