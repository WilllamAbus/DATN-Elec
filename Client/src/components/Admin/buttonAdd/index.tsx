import { Link } from "react-router-dom";
import { icons } from "./icon/icons";
import { links } from "./link/link";
import { labels } from "./label/labels";
import styles from "./css/AddButton.module.css";

interface AddProductButtonProps {
  type: keyof typeof links;
}

function AddProductButton({ type }: AddProductButtonProps) {
  const icon = icons[type];
  const link = links[type][0];
  const label = labels[type];

  return (
    <div className={styles.container}>
      <Link
        to={link.to}
        id="createProductButton"
        data-modal-toggle="createProductModal"
        className={styles.button}
      >
        {icon}
        {label}
      </Link>
    </div>
  );
}

export default AddProductButton;
