const modelProductVariant = require('../../../model/product_v2/productVariant');


const getOneProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const productVariant = await modelProductVariant.findById(id).populate([
      { path: 'battery' },
      { path: 'color' },
      { path: 'cpu' },
      { path: 'operatingSystem' },
      { path: 'ram' },
      { path: 'screen' },
      { path: 'storage' },
      { path: 'image', select: 'image color' },
      { path: 'inventory', select: 'quantityShelf quantityStock totalQuantity price totalPrice status createdAt updatedAt' },
    ]);
    

    if (!productVariant) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: "Không tìm thấy sản phẩm",
        status: 404
      });
    }

    res.status(200).json({
      success: true,
      err: 0,
      msg: 'Lấy sản phẩm thành công',
      status: 200,
      productVariant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      err: 2,
      msg: "Lỗi server",
      status: 500
    });
  }
}

module.exports = {
  getOneProductVariant
}
