export interface Recommendation {
    itemId: string;
    itemType: "productVariant"; // Chỉ còn loại 'productVariant'
    score: number;
    itemDetails: ItemDetails; // Thông tin chi tiết về productVariant
    images: ProductImage[]; // Danh sách ảnh
    variantPrice: number; // Giá sản phẩm (variant_price)
    discountPercent: number; // % Giảm giá (discountPercent)
}

export interface ItemDetails {
    _id: string;
    variant_name: string; // Tên phiên bản sản phẩm
    variant_price: number; // Giá bán
    variant_original_price: number; // Giá gốc
    product_discount?: Discount; // Giảm giá (nếu có)
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

export interface ProductDetails {
    product_ratingAvg?: number; // Điểm đánh giá trung bình
    weight_g?: number; // Trọng lượng
    slug?: string; // Đường dẫn ngắn của sản phẩm
}

export interface Discount {
    _id?: string; // Mã giảm giá
    code?: string; // Mã code giảm giá
    discountPercent?: number; // % Giảm giá
    isActive?: boolean; // Trạng thái kích hoạt
    status?: string; // Trạng thái
    disabledAt?: string | null; // Ngày bị vô hiệu hóa
    createdAt?: string; // Ngày tạo (ISO 8601)
    updatedAt?: string; // Ngày cập nhật (ISO 8601)
}
