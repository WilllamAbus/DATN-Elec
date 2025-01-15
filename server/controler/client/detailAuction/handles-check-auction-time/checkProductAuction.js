const ProductAuction = require("../../../../model/productAuction/productAuction");

const checkProductAuction = async (slug) => {
  try {
    const productAuction = await ProductAuction.findOne({ slug });
    if (!productAuction) {
      throw {
        status: 404,
        code: "NOT_FOUND",
        message: "Sản phẩm không tồn tại."
      };
    }
    return productAuction;
  } catch (error) {
    throw {
      status: 500,
      code: "SERVER_ERROR",
      message: "Lỗi server khi tìm kiếm sản phẩm."
    };
  }
};

module.exports = checkProductAuction;
