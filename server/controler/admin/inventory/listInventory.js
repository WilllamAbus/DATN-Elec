const modelInventory = require('../../../model/inventory/inventory.model');
const list = async (req, res) => {
  try {
    const inventories = await modelInventory.find({ status: { $ne: 'disable' } })
      .populate('product_id', 'product_name')
      .populate('supplier', 'name'); 

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Lấy danh sách tồn kho thành công',
      status: 200,
      inventories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Lấy danh sách tồn kho thất bại',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  list,
};