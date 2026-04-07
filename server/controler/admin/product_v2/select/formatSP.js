const modelFormatShopping = require('../../../../model/formatShopping.model'); 
const selectProductFormat = async (req, res) => {
  try {
    const productFormats = await modelFormatShopping.find({ status: { $ne: 'disable' } });
    
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Select product formats ok',
      status: 200,
      productFormats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Select product formats lỗi',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  selectProductFormat,
};
