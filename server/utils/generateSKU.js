const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/đ/g, 'd') 
    .replace(/Đ/g, 'D') 
    .replace(/\s+/g, '-') 
    .toUpperCase(); 
};

const generateSKU = (name) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const words = name.split(' ');
  const initials = words.map(word => word.charAt(0).toUpperCase()).join('-');
  return `${initials}-${formattedDate}-${Math.floor(Math.random() * 1000)}`;
};

module.exports = generateSKU;
