import React, { useState } from "react";
import { Box, TextField, Button, InputAdornment, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface FilterByPriceProps {
  onchange?: (minPrice: number | null, maxPrice: number | null) => void;
}

const FilterByPrice: React.FC<FilterByPriceProps> = ({ onchange }) => {
  const theme = useTheme();
  const [values, setValues] = useState({
    minPrice: 0,
    maxPrice: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const parsePrice = (formattedPrice: string) => {
    return parseFloat(formattedPrice.replace(/[^\d]/g, '')) || 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: parsePrice(value),
    }));
  };

  const handleSubmit = () => {
    if (!values.minPrice || !values.maxPrice) {
      setError("Vui lòng điền khoảng giá phù hợp");
      return;
    }
    if (values.minPrice > values.maxPrice) {
      setError("Giá trị đầu phải nhỏ hơn hoặc bằng giá trị sau");
    } else {
      setError(null);
      if (onchange) {
        onchange(values.minPrice, values.maxPrice);
      }
    }
  };

  const handleReset = () => {
    setValues({
      minPrice: 0,
      maxPrice: 0,
    });
    setError(null);
    if (onchange) {
      onchange(null, null);
    }
  };

  return (
    <Box sx={{ padding: theme.spacing(1) }}>
      <span className="font-medium text-gray-900">Lọc theo khoảng giá</span>
      <Box
        sx={{
          display: "flex",
          flexFlow: "row nowrap",
          alignItems: "center",
          marginTop: theme.spacing(1),
          marginBottom: theme.spacing(1),
        }}
      >
        <TextField
          name="minPrice"
          label="Giá tối thiểu"
          onChange={handleChange}
          value={formatPrice(values.minPrice)}
          fullWidth
          variant="filled"
          color="primary"
          focused
          InputProps={{
            endAdornment: <InputAdornment position="end">₫</InputAdornment>,
          }}
        />
        <span style={{ margin: "0 8px" }}>-</span>
        <TextField
          name="maxPrice"
          label="Giá tối đa"
          onChange={handleChange}
          value={formatPrice(values.maxPrice)}
          fullWidth
          variant="filled"
          color="primary"
          focused
          InputProps={{
            endAdornment: <InputAdornment position="end">₫</InputAdornment>,
          }}
        />
      </Box>
      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          gap: theme.spacing(1),
          marginTop: theme.spacing(2),
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          size="small"
          sx={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
          Áp dụng
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleReset}
          size="small"
          sx={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
          Xóa bộ lọc
        </Button>
      </Box>
    </Box>
  );
};

export default FilterByPrice;
