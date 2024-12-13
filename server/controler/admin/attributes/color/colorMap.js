const colorMap = {
  'Màu Đen': '#000000',
  'Màu Trắng': '#FFFFFF',
  'Màu Đỏ': '#FF0000',
  'Màu Lime': '#00FF00',
  'Màu Xanh Dương': '#0000FF',
  'Màu Vàng': '#FFFF00',
  'Màu Cyan': '#f8e7c3',
  'Màu Magenta': '#FF00FF',
  'Màu Bạc': '#C0C0C0',
  'Màu Xám': '#808080',
  'Màu Maroon': '#800000',
  'Màu Olive': '#808000',
  'Màu Xanh Lá': '#a5ce8b',
  'Màu Tím': '#f0d9ea',
  'Màu Teal': '#008080',
  'Màu Navy': '#000080',
  'Màu Titan tự nhiên': '#bbb4a7',
  'Màu Titan đen': '#3f4142',
  'Màu Titan Sa Mạc': '#c4ab96',
  'Màu Hồng': '#fde3e3',
  'Màu Xanh Rêu': '#747a6f',
  'Màu Xanh Mòng Két': '#aed6d3',
  'Màu Xanh Dương': '#d9e8f7',
  'Màu Titan Trắng': '#f2f1ec',
  'Màu Xanh Lưu Ly': '#9badf7'
};

const getColorCode = (name) => {
  return colorMap[name] || '#000000'; 
};

module.exports = getColorCode;