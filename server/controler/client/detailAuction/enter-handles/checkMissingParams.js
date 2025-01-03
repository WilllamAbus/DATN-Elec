module.exports = (slug, bidPrice) => {
  if (!slug || !bidPrice) {
    return {
      success: false,
      err: 1,
      msg: 'Thiếu thông tin cần thiết (slug, userId, bidPrice)',
      status: 'error',
    };
  }
  return null;
};
