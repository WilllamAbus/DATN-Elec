export interface Recommendation {
    image: string[]; // Danh sách URL ảnh
    product_name: string; // Tên sản phẩm
    slug: string; // Slug của sản phẩm
  }
  
  export interface RelatedProductsAuctionResponse {
    "Sản phẩm gợi ý": Recommendation[]; // Danh sách sản phẩm gợi ý
  }
  