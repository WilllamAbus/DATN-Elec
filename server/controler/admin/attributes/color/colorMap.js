const colorMap = {
  'Màu Đen': '#000000',
  'Màu Trắng': '#FFFFFF',
  'Màu Đỏ': '#FF0000',
  'Màu Lime': '#00FF00',
  'Màu Xanh Dương': '#0000FF',
  'Màu Vàng': '#FFFF00',
  'Màu Cyan': '#00FFFF',
  'Màu Magenta': '#FF00FF',
  'Màu Bạc': '#C0C0C0',
  'Màu Xám': '#808080',
  'Màu Maroon': '#800000',
  'Màu Olive': '#808000',
  'Màu Xanh Lá': '#008000',
  'Màu Tím': '#800080',
  'Màu Teal': '#008080',
  'Màu Navy': '#000080',
  'Màu Titan tự nhiên': '#bbb4a7',
};

const getColorCode = (name) => {
  return colorMap[name] || '#000000'; 
};

module.exports = getColorCode;