const modelCategory = require('../../../model/catgories.model'); 

const listcatenav = async (req, res) => {
  try {
    const navItems = await modelCategory.find({ status: { $ne: 'disable' } });
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Chọn danh mục thành công',
      status: 200,
      navItems
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi chọn danh mục',
      status: 500,
      error: error.message,
    });
  }
};
module.exports = {
  listcatenav,
};
