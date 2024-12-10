import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
interface ProductAuctionSortProps {
  currentSort: string;
  onChange?: (newValue: string) => void;
}
const ProductAuctionSort: React.FC<ProductAuctionSortProps> = ({ currentSort, onChange }) => {
  const handleSortChange = (_event: React.SyntheticEvent, newValue: string) => {
    if (onChange) onChange(newValue);
  };
  return (
    <div className="pb-1">
      {" "}
      <Tabs
        value={currentSort}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleSortChange}
        aria-label="sort tabs example"
      >
        <Tab
          label="Giá thấp tới cao"
          value="product_price:ASC"
          sx={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        />
        <Tab label="Giá cao xuống thấp" value="product_price:DESC"
            sx={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        />
      </Tabs>
    </div>
  );
};
export default ProductAuctionSort;
