export interface Inventory {
    _id: string;
    product_id: string,
    product_variant: string,
    quantityShelf: number;
    quantityStock: number;
    totalQuantity: number;
    supplier: string;
    price: number;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
  }
  