
import styles from "../css/section.module.css";
import { ProductVariant } from "../../../../../services/home/types/getAccessoryByVariants";
import ProductItem from "../productItem/accessory";
export interface ProductListAccessoryProps {
  productVariant: ProductVariant[];
}
export default function ProductListAccessory({ productVariant }: ProductListAccessoryProps) {
  return (
    <div className={styles.gridContainer}>
      {productVariant.map((product, index) => (
        <ProductItem key={index} productVariant={product} index={index} />
      ))}
    </div>
  );
}
