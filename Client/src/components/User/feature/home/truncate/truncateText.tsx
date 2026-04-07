export const truncateText = (text: string, maxLength: number) => {
  if (!text || typeof text !== 'string') {
    return ''; // Trả về chuỗi rỗng nếu text không phải là chuỗi hợp lệ
  }
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};
