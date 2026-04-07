import React, { useMemo } from 'react';
import { Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FilterState } from '../../../../../services/clientcate/client/types/getProuctbyCategory';


interface FilterViewerProps {
  filters: FilterState;
  onChange?: (newFilters: FilterState) => void;
}

const FilterViewer: React.FC<FilterViewerProps> = ({ filters, onChange }) => {
  const theme = useTheme();

  const formatPrice = (price: number | null) => {
    return price !== null ? new Intl.NumberFormat('vi-VN').format(price) : 'Chưa xác định';
  };

  const FILTER_LIST = useMemo(() => [
    {
      id: 1,
      type: 'condition',
      getLabel: (filters: FilterState) => {
        const conditions = filters.conditionShopping ?? [];
        return conditions.map(condition => condition.nameCondition).join(', ') || 'Điều kiện mua sắm';
      },
      isVisible: (filters: FilterState) => filters.conditionShopping && filters.conditionShopping.length > 0,
      isActive: (filters: FilterState) => filters.conditionShopping && filters.conditionShopping.length > 0,
      isRemovable: true,
      onRemove: (filters: FilterState) => {
        const newFilters = { ...filters };
        delete newFilters.conditionShopping;
        return newFilters;
      },
      onToggle: (filters: FilterState): FilterState => filters,
    },
    {
      id: 2,
      type: 'price',
      getLabel: (filters: FilterState) => `Từ ${formatPrice(filters.minPrice ?? null)} đến ${formatPrice(filters.maxPrice ?? null)}`,
      isVisible: (filters: FilterState) => filters.minPrice !== undefined && filters.maxPrice !== undefined,
      isActive: (filters: FilterState) => filters.minPrice !== undefined && filters.maxPrice !== undefined,
      isRemovable: true,
      onRemove: (filters: FilterState) => {
        const newFilters = { ...filters };
        delete newFilters.minPrice;
        delete newFilters.maxPrice;
        return newFilters;
      },
      onToggle: (filters: FilterState): FilterState => filters,
    },
    {
      id: 3,
      type: 'brand',
      getLabel: (filters: FilterState) => {
        const brands = filters.brand ?? [];
        return brands.map(brand => brand.name).join(', ') || 'Thương hiệu';
      },
      isVisible: (filters: FilterState) => filters.brand && filters.brand.length > 0,
      isActive: (filters: FilterState) => filters.brand && filters.brand.length > 0,
      isRemovable: true,
      onRemove: (filters: FilterState) => {
        const newFilters = { ...filters };
        delete newFilters.brand;
        return newFilters;
      },
      onToggle: (filters: FilterState): FilterState => filters,
    },
    {
      id: 4,
      type: 'discount',
      getLabel: (filters: FilterState) => {
        const min = filters.minDiscountPercent ?? null;
        return min !== null ? `Giảm giá từ ${min}%` : 'Giảm giá';
      },
      isVisible: (filters: FilterState) => filters.minDiscountPercent !== undefined,
      isActive: (filters: FilterState) => filters.minDiscountPercent !== undefined,
      isRemovable: true,
      onRemove: (filters: FilterState) => {
        const newFilters = { ...filters };
        delete newFilters.minDiscountPercent;
        delete newFilters.maxDiscountPercent;
        return newFilters;
      },
      onToggle: (filters: FilterState): FilterState => filters,
    },
    {
      id: 5,
      type: 'ram',
      getLabel: (filters: FilterState) => {
        const rams = filters.ram ?? [];
        return rams.map(ram => ram.name).join(', ') || 'Ram';
      },
      isVisible: (filters: FilterState) => filters.ram && filters.ram.length > 0,
      isActive: (filters: FilterState) => filters.ram && filters.ram.length > 0,
      isRemovable: true,
      onRemove: (filters: FilterState) => {
        const newFilters = { ...filters };
        delete newFilters.ram;
        return newFilters;
      },
      onToggle: (filters: FilterState): FilterState => filters,
    },
    {
      id: 6,
      type: 'storage',
      getLabel: (filters: FilterState) => {
        const storages = filters.storage ?? [];
        return storages.map(storage => storage.name).join(', ') || 'Storage';
      },
      isVisible: (filters: FilterState) => filters.storage && filters.storage.length > 0,
      isActive: (filters: FilterState) => filters.storage && filters.storage.length > 0,
      isRemovable: true,
      onRemove: (filters: FilterState) => {
        const newFilters = { ...filters };
        delete newFilters.storage;
        return newFilters;
      },
      onToggle: (filters: FilterState): FilterState => filters,
    },
  ], [filters]);

  const visibleFilters = useMemo(() => {
    return FILTER_LIST.filter(filter => filter.isVisible(filters));
  }, [filters, FILTER_LIST]);

  const handleRemoveCondition = (conditionId: string) => {
    const newConditions = (filters.conditionShopping ?? []).filter(condition => condition._id !== conditionId);
    const newFilters = { ...filters, conditionShopping: newConditions };
    if (onChange) {
      onChange(newFilters);
    }
  };

  const handleRemoveBrand = (brandId: string) => {
    const newBrands = (filters.brand ?? []).filter(brand => brand._id !== brandId);
    const newFilters = { ...filters, brand: newBrands };
    if (onChange) {
      onChange(newFilters);
    }
  };
  const handleRemoveRam = (ramId: string) => {
    const newRams = (filters.ram ?? []).filter(ram => ram._id !== ramId);
    const newFilters = { ...filters, ram: newRams };
    if (onChange) {
      onChange(newFilters);
    }
  };
  const handleRemoveStorage = (StorageId: string) => {
    const newStorages = (filters.storage ?? []).filter(storage => storage._id !== StorageId);
    const newFilters = { ...filters, storage: newStorages };
    if (onChange) {
      onChange(newFilters);
    }
  };

  const handleRemovePrice = () => {
    const newFilters = { ...filters };
    delete newFilters.minPrice;
    delete newFilters.maxPrice;
    if (onChange) {
      onChange(newFilters);
    }
  };

  const handleRemoveDiscount = () => {
    const newFilters = { ...filters };
    delete newFilters.minDiscountPercent;
    delete newFilters.maxDiscountPercent;
    if (onChange) {
      onChange(newFilters);
    }
  };

  return (
    <Box
      component="ul"
      sx={{
        padding: theme.spacing(1),
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        listStyleType: 'none',
      }}
    >
      {visibleFilters.map((filter) => (
        <li key={filter.id}>
          {filter.type === 'condition' && (filters.conditionShopping ?? []).map(condition => (
            <Chip
              key={condition._id}
              label={condition.nameCondition}
              color='primary'
              size='small'
              onDelete={() => handleRemoveCondition(condition._id)}
              sx={{ margin: theme.spacing(0.5) }}
            />
          ))}
          {filter.type === 'price' && (
            <Chip
              label={filter.getLabel(filters)}
              color='primary'
              size='small'
              onDelete={handleRemovePrice}
              sx={{ margin: theme.spacing(0.5) }}
            />
          )}
          {filter.type === 'brand' && (filters.brand ?? []).map(brand => (
            <Chip
              key={brand._id}
              label={brand.name}
              color='primary'
              size='small'
              onDelete={() => handleRemoveBrand(brand._id)}
              sx={{ margin: theme.spacing(0.5) }}
            />
          ))}
            {filter.type === 'ram' && (filters.ram ?? []).map(ram => (
            <Chip
              key={ram._id}
              label={ram.name}
              color='primary'
              size='small'
              onDelete={() => handleRemoveRam(ram._id)}
              sx={{ margin: theme.spacing(0.5) }}
            />
          ))}
           {filter.type === 'storage' && (filters.storage ?? []).map(storage => (
            <Chip
              key={storage._id}
              label={storage.name}
              color='primary'
              size='small'
              onDelete={() => handleRemoveStorage(storage._id)}
              sx={{ margin: theme.spacing(0.5) }}
            />
          ))}
          {filter.type === 'discount' && (
            <Chip
              label={filter.getLabel(filters)}
              color='primary'
              size='small'
              onDelete={handleRemoveDiscount}
              sx={{ margin: theme.spacing(0.5) }}
            />
          )}
        </li>
      ))}
    </Box>
  );
};

export default FilterViewer;
