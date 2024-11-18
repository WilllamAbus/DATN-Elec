export interface Color {
  _id: string;
  name: string;
  code: string;
}

export interface ProductVariant {
  _id: string;
}

export interface ImageVariant {
  _id: string;
  image: string[];
  productVariant: ProductVariant;
  color: Color;
  price: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface GetOneImageVariantResponse {
  success: boolean;
  msg: string;
  imageVariant: ImageVariant | undefined;
}
