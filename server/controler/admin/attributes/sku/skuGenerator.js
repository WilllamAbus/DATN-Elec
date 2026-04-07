const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/đ/g, 'd') 
    .replace(/Đ/g, 'D') 
    .replace(/\s+/g, '-') 
    .toUpperCase(); 
};

const generateSKU = (productName) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; 
  const productCode = removeVietnameseTones(productName); 
  return `${productCode}-${formattedDate}-${Math.floor(Math.random() * 1000)}`;
};

module.exports = generateSKU;
