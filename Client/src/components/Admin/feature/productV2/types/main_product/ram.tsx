

  import { UseFormSetValue } from "react-hook-form";
  import { Product } from "../../../../../../services/product_v2/admin/types/add-product";
  export type SetValueRam = UseFormSetValue<Product>;
  export interface RamOption {
    value: string;
    label: string;
  }