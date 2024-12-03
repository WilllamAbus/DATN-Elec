export interface Recommendation {
    itemId: string;
    itemType: "productVariant" | "productAuction"; // Loại sản phẩm
    score: number;
    itemDetails: ItemDetails | AuctionDetails; // Thông tin chi tiết, tùy loại
    images: Image[]; // Danh sách ảnh (chung cho cả 2 loại)
    discountPercent?: number; // % Giảm giá
}

export interface ItemDetails {
    _id: string;
    variant_name: string; // Tên phiên bản sản phẩm
    variant_price: number; // Giá bán
    variant_original_price: number; // Giá gốc
    product_discount?: Discount; // Giảm giá
    battery?: string; // Dung lượng pin (nếu có)
    color?: string[]; // Các màu sắc có sẵn
    ram?: string; // RAM
    storage?: string; // Bộ nhớ trong
    image: ProductImage[]; // Hình ảnh của productVariant
    sku?: string; // Mã sản phẩm
    pid?: string; // Product ID
    status: string; // Trạng thái
    product?: ProductDetails; // Thông tin chung về sản phẩm
    inventory?: string[]; // Danh sách tồn kho
    viewCount?: number; // Lượt xem
    lastViewed?: string; // Ngày xem gần nhất (ISO 8601)
    createdAt: string; // Ngày tạo (ISO 8601)
    updatedAt: string; // Ngày cập nhật (ISO 8601)
    slug: string; // Đường dẫn ngắn
    __v: number; // Version
}

export interface AuctionDetails {
    _id: string;
    product_name: string; // Tên sản phẩm đấu giá
    product_description: string; // Mô tả sản phẩm
    product_type: string; // Loại sản phẩm
    product_brand: string; // Hãng sản xuất
    product_condition: string; // Tình trạng sản phẩm
    product_supplier: string; // Nhà cung cấp
    product_ratingAvg?: number; // Điểm đánh giá trung bình
    product_view?: number; // Số lượt xem
    product_price: number; // Giá sản phẩm
    product_price_unit: number; // Giá từng đơn vị
    weight_g?: number; // Trọng lượng (nếu có)
    isActive: boolean; // Sản phẩm có hoạt động không
    status: string; // Trạng thái
    disabledAt?: string | null; // Ngày tắt (nếu có)
    comments?: any[]; // Danh sách bình luận
    createdAt: string; // Ngày tạo (ISO 8601)
    updatedAt: string; // Ngày cập nhật (ISO 8601)
    slug: string; // Đường dẫn ngắn
    __v: number; // Version
    image: string[]; // Hình ảnh của sản phẩm đấu giá
}

export interface ProductImage {
    _id: string;
    image: string[]; // Danh sách hình ảnh
    productVariant?: string; // Mã phiên bản sản phẩm (nếu có)
    color?: string; // Màu sắc
    price?: number; // Giá
    createdAt: string; // Ngày tạo (ISO 8601)
    updatedAt: string; // Ngày cập nhật (ISO 8601)
    slug: string; // Đường dẫn ngắn
    __v: number; // Version
}

export interface Image {
    _id: string;
    image: string[]; // Danh sách hình ảnh
    productVariant?: string; // Mã phiên bản sản phẩm (nếu có)
    color?: string; // Màu sắc
    price?: number; // Giá
    createdAt: string; // Ngày tạo (ISO 8601)
    updatedAt: string; // Ngày cập nhật (ISO 8601)
    slug: string; // Đường dẫn ngắn
    __v: number; // Version
}

export interface ProductDetails {
    product_ratingAvg?: number; // Điểm đánh giá trung bình
    weight_g?: number; // Trọng lượng
    slug?: string;
}

export interface Discount {
    discountId?: string; // Mã giảm giá
    code?: string; // Mã code giảm giá
    discountPercent?: number; // % Giảm giá
    isActive?: boolean; // Trạng thái kích hoạt
    status?: string; // Trạng thái
    disabledAt?: string | null; // Ngày bị vô hiệu hóa
    createdAt?: string; // Ngày tạo (ISO 8601)
    updatedAt?: string; // Ngày cập nhật (ISO 8601)
}
