const getVariantFilters = (ram, pin, color) => {
  const filters = [];

  if (ram && ram.length > 0) {
    filters.push({
      variant_attributes: {
        $elemMatch: { k: "RAM", v: { $in: ram.map(r => mongoose.Types.ObjectId(r)) } }
      }
    });
  }

  if (pin && pin.length > 0) {
    filters.push({
      variant_attributes: {
        $elemMatch: { k: "Pin", v: { $in: pin.map(p => mongoose.Types.ObjectId(p)) } }
      }
    });
  }

  if (color && color.length > 0) {
    filters.push({
      variant_attributes: {
        $elemMatch: { k: "Color", v: { $in: color.map(c => mongoose.Types.ObjectId(c)) } }
      }
    });
  }

  return filters.length ? { $or: filters } : {};
};

module.exports = getVariantFilters ;
