
import styles from "../css/section.module.css";
import { ProductVariant } from "../../../../../services/home/types/getPhoneByVariants";
import ProductItem from "../productItem/phone";
export interface ProductListPhoneProps {
  productVariant: ProductVariant[];
}
export default function ProductListPhone({ productVariant }: ProductListPhoneProps) {
  return (
    <div className={styles.gridContainer}>
      {productVariant.map((product, index) => (
        <ProductItem key={index} productVariant={product} index={index} />
      ))}
    </div>
  );
}
