const modelInbound = require('../../../model/inboundShipments.model');
const list = async (req, res) => {
  try {
    const products = await modelInbound.find()
    .populate('inbound_supplier', 'name')
    .populate('product_id', 'product_name');
      
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Lấy danh sách lô hàng thành công',
      status: 200,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Lấy danh sách lô hàng thất bại',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  list,
};
