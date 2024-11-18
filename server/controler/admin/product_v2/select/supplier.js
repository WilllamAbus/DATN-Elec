const modelSupplier = require('../../../../model/suppliers.model');
const selectSupplier = async (req, res) => {
  try {
      const selectSuppliers = await modelSupplier.find({ status: { $ne: 'disable' } }).select('_id name');
      return res.status(200).json({
        success: true,
        err: 0,
        msg: 'Select Supplier ok',
        status: 200,
        selectSuppliers
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Select Supplier lỗi',
      status: 500,
      error: error.message,
    });
  }
};
module.exports = {
  selectSupplier,
};
