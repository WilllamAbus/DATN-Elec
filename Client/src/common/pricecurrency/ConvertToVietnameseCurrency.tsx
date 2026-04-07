

export const convertToVietnameseCurrency = (number: number) => {
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toLocaleString()} triệu đồng`;
  }
  if (number >= 1_000) {
    return `${(number / 1_000).toLocaleString()} nghìn đồng`;
  }
  return `${number.toLocaleString()} đồng`;
};
