export interface timeTrackProducts {
    _id: string; // Add _id property
    product_name: string;
    product_description: string;
    product_format: string;
    product_condition: string;
    product_supplier: string;
    product_ratingAvg?: number; // Optional property
    product_view?: number; // Optional property
    product_price_unit: number;
    weight_g: number;
    product_slug?: string; // Optional property
    images: ProductImage[]; // Use the Image interface for images array
   
    endTime: string;
  }

 
 // src/types/product.ts

// src/types/Product.ts
export interface ProductImage {
    url: string;
    alt: string;
  }
  
 
  
  export interface ProductDetails {
    _id: string;
    product_name: string;
    product_description: string;
    product_format: string;
    product_condition: string;
    product_supplier: string;
    product_ratingAvg: number;
    product_view: number;
    product_price_unit: number;
    weight_g: number;
    product_slug: string;
    images: ProductImage[];

    endTime: string;
    endTimeBid: string
  }
  
  export interface ProductResponse {
    success: boolean;
    status: number;
    data: ProductDetails;
  }
  
  