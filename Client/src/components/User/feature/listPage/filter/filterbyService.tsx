import React from "react";
import { Box, Radio, FormControlLabel, RadioGroup } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface FilterByServiceProps {
  filters: {
    minDiscountPercent?: number;
    maxDiscountPercent?: number;
  };
  onchange: (minDiscountPercent: number | null, maxDiscountPercent: number | null) => void;
}

const FilterByService: React.FC<FilterByServiceProps> = ({ filters = { minDiscountPercent: null, maxDiscountPercent: null }, onchange }) => {
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    let minDiscountPercent: number | null = null;
    let maxDiscountPercent: number | null = null;

    if (value === 'lightDiscount') {
      minDiscountPercent = 1;
      maxDiscountPercent = null;
    } else if (value === 'deepDiscount') {
      minDiscountPercent = 30;
      maxDiscountPercent = null;
    } else if (value === 'noDiscount') {
      minDiscountPercent = null;
      maxDiscountPercent = null;
    }

    onchange(minDiscountPercent, maxDiscountPercent);
  };


  const currentSelection = filters.minDiscountPercent === 1 ? 'lightDiscount' :
    filters.minDiscountPercent === 30 ? 'deepDiscount' : 'noDiscount';

  const isClearDisabled = currentSelection === 'noDiscount';

  return (
    <Box sx={{ padding: theme.spacing(1), borderTop: `1px solid ${theme.palette.grey[200]}` }}>
      <span className="font-medium text-gray-900 text-sm">Dịch vụ</span>
      <Box sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }}>
        <RadioGroup value={currentSelection} onChange={handleChange}>
          <FormControlLabel
            value="noDiscount"
            control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 14 }, cursor: isClearDisabled ? 'not-allowed' : 'pointer' }} />}
            label="Bỏ chọn"
            disabled={isClearDisabled}
            className="opacity-50 cursor-not-allowed"
          />
          <FormControlLabel
            value="lightDiscount"
            control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 14 } }} />}
            label="Có giảm giá"
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
          className="text-sm text-gray-600"
          />
          <FormControlLabel
            value="deepDiscount"
            control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 14 } }} />}
            label="Giảm giá sâu (trên 30%)"
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' }, }}
            className="text-sm text-gray-600"
          />
        </RadioGroup>
      </Box>
    </Box>
  );
};

export default FilterByService;
