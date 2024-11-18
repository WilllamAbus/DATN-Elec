import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { commonIcon } from "./icon/icons";
import { links } from "./link/link";
import { labels } from "./label/labels";
import styles from "./css/AddButton.module.css";
import { Spinner } from "@nextui-org/react";

interface AddButtonProps {
  type: keyof typeof links;
}

function AddButton({ type }: AddButtonProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const link = links[type][0];
  const label = labels[type];

  const handleClickNavigate = (to: string) => {
    setLoadingId(to);
    setTimeout(() => {
      setLoadingId(null);
      navigate(to);
    }, 1000); 
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => handleClickNavigate(link.to)}
        disabled={loadingId === link.to}
        className={styles.button}
      >
        {loadingId === link.to ? (
          <Spinner size="sm" color="default" />
        ) : (
          commonIcon
        )}
        {label}
      </button>
    </div>
  );
}

export default AddButton;
