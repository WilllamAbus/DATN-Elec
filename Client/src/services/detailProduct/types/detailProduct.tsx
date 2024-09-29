export interface ProductRelated {
    _id: string;
    image: string[];
    product_discount: {
      discountPercent: number;
    };
    product_name: string;
    product_ratingAvg: number | null;
    product_quantity: number;
    product_price: number;
  }