// Interface chính cho danh sách sản phẩm bán chạy
export interface BestSellingProductResponse {
    success: boolean; // Trạng thái thành công của API
    data: BestSellingProduct[]; // Mảng các sản phẩm bán chạy
  }
  
  // Interface cho từng sản phẩm bán chạy
  export interface BestSellingProduct {
    totalQuantity: number; // Tổng số lượng bán được
    totalRevenue: number; // Tổng doanh thu từ sản phẩm
    productId: string; // ID sản phẩm
    productDetails: ProductDetails; // Thông tin chi tiết của sản phẩm
    discountPercent: number;
    totalViewCount: number;
    totalOriginalPrice: number;
    variant_price: number;
  }
  
  // Interface cho chi tiết sản phẩm
  export interface ProductDetails {
    _id: string; // ID sản phẩm
    product_name: string; // Tên sản phẩm
    image: string[]; // Mảng hình ảnh
    product_description: string; // Mô tả sản phẩm
    sku: string; // Mã SKU
    pid: string; // PID (Product Identifier)
    product_type: string; // Loại sản phẩm (ID category)
    product_brand: string; // Thương hiệu (ID brand)
    product_condition: string; // Tình trạng sản phẩm
    product_supplier: string; // Nhà cung cấp sản phẩm
    product_ratingAvg: number; // Đánh giá trung bình
    product_view: number; // Số lượt xem sản phẩm
    weight_g: number; // Khối lượng sản phẩm (gram)
    status: string; // Trạng thái sản phẩm (active/disable)
    disabledAt: string | null; // Ngày bị vô hiệu hóa (nếu có)
    variants: string[]; // Danh sách các ID variant của sản phẩm
    hasVariants: boolean; // Có variant hay không
    comments: string[]; // Danh sách ID comment
    createdAt: string; // Ngày tạo sản phẩm (ISO string)
    updatedAt: string; // Ngày cập nhật sản phẩm (ISO string)
    slug: string; // Slug của sản phẩm
    __v: number; // Phiên bản của document trong MongoDB
  }
  