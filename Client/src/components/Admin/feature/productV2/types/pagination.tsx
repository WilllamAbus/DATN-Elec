  interface Product {
    product_name: string;
    image: string;
    product_description: string;
    product_slug: string;
    product_discount: number;
    product_brand: { name: string };
    product_format: { name: string };
    product_condition: { name: string };
    product_supplier: { name: string };
    product_quantity: number;
    product_ratingAvg: number;
    product_view: number;
    product_price: number;
    product_price_unit: string;
    product_attributes: Record<string, any>;
    weight_g: number;
    isActive: boolean;
    status: string;
    disabledAt: Date | null;
    comments: string[];
  }

  interface Pagination {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }

  interface LimitCrudProductResponse {
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
