const modelProductAuction = require('../../../model/productAuction/productAuction');
const getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await modelProductAuction.findById(id)
    .populate('product_type', 'name')
    .populate('product_brand', 'name') 
    .populate('product_condition', 'nameCondition') 
    .populate('product_supplier', 'name'); 

    if (!product) {
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
      product
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
  getOne
}
