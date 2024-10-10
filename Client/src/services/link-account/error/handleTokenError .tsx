export const handleTokenError = (error: unknown) => {
  if (error instanceof Error) {
    console.error("Token không hợp lệ hoặc không thể giải mã:", error.message);
  } else {
    console.error("Token không hợp lệ hoặc không thể giải mã:", error);
  }
};
