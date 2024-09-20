// export interface CartItem {
//   _id: string;
//   product: {
//     _id: string;
//     product_name: string;
//     product_description: string;
//     product_type: string;
//     createdAt: string;
//     product_discount: number;
//     product_supplier: string;
//     product_brand: string;
//     product_format: string;
//     product_condition: string;
//     product_quantity: number;
//     product_price: number;
//     product_price_unit: number;
//     product_attributes: { k: string; v: string }[];
//     weight_g: number;
//     image: string[];
//   };
//   quantity: number;
//   price: number;
//   totalItemPrice: number;
//   isSelected?: boolean;
//   inventory: {
//     _id: string;
//     quantityShelf: number;
//   };
// }

// export interface CartType {
//   _id: string;
//   user: {
//     _id: string;
//     name: string;
//     email: string;
//     address: string;
//     phone: string;
//   };
//   items: CartItem[];
//   totalPrice: number;
//   stateNotifi: string;
//   isActive: boolean;
//   status: string;
//   disabledAt: string | null;
//   modifiedOn: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }
export interface CartItem {
  _id: string;
  product: {
    _id: string;
    product_name: string;
    product_description: string;
    product_type: string;
    createdAt: string;
    product_discount: number;
    product_supplier: string;
    product_brand: string;
    product_format: string;
    product_condition: string;
    product_quantity: number;
    product_price: number;
    product_price_unit: number;
    product_attributes: { k: string; v: string }[];
    weight_g: number;
    image: string[];
  };
  quantity: number;
  price: number;
  totalItemPrice: number;
  isSelected?: boolean;
  inventory: {
    _id: string;
    product: string;
    quantityShelf: number;
    quantityStock: number;
    totalQuantity: number;
    supplier: string;
    price: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface CartType {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: CartItem[];
  totalPrice: number;
  stateNotifi: string;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
