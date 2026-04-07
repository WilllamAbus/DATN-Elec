// Interface cho Color của Image
export interface Color {
  _id: string;
  name: string;  // Tên của màu
  code: string;  // Mã màu (hex code)
}

// Interface cho Image
export interface Image {
  _id: string;
  image: string[]; // Danh sách URL của ảnh
  color: Color;    // Thông tin màu sắc của ảnh
}

// Interface cho ProductVariantData
export interface ProductVariantData {
  _id: string; 
  product_name: string;     // Tên sản phẩm
  slug: string;             // Slug sản phẩm
  variant_name: string;     // Tên variant
  variant_price: number;    // Giá của variant
  image: Image[];           // Danh sách các ảnh của variant
}

// Interface cho phản hồi từ API
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;       // Tổng số items
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Interface cho phản hồi từ API
export interface GetAllProductVariantsByVariantPriceResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: ProductVariantData[]; // Danh sách các sản phẩm
  pagination?: Pagination;    // Thông tin về phân trang (optional)
}