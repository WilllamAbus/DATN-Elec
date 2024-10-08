
import styles from "./css/section.module.css";
import { products } from "../../../../services/clientcate/client/types/getProuctbyCategory";
import ProductItem from "./productItem";
export interface ProductListProps {
  products: products[];
}
export default function ProductList({ products }: ProductListProps) {
  return (
    <div className={styles.gridContainer}>
      {products.map((product, index) => (
        <ProductItem key={index} product={product} index={index} />
      ))}
    </div>
  );
}
