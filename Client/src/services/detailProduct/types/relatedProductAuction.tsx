export interface Recommendation {
    image: string[]; // Danh sách URL ảnh
    product_name: string; // Tên sản phẩm
    slug: string; // Slug của sản phẩm
    brand_name: string;
    supplier_name: string;
  }
  
  export interface RelatedProductsAuctionResponse {
    "Sản phẩm gợi ý": Recommendation[]; // Danh sách sản phẩm gợi ý
  }
  