
export interface Variant {
  _id: string;
  variant_name: string;
  variant_price: number;
  battery: string;
  color: string[];
  cpu: string;
  operatingSystem: string;
  ram: string;
  screen: string;
  storage: string;
  sku: string;
  pid: string;
  status: string;
  product: string;
  inventory: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  image?: {
    _id: string;
    image: string[];
    color: string;
  }[];
}

export interface ProductVariantResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  response: {
    total: number;
    variants: Variant[];
  };
}
