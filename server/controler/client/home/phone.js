const GetPhoneVariantsService = require('../../../services/home/phone/getPhoneVariants.Service');
const Category = require('../../../model/catgories.model');

const getPhoneByVariants = async (req, res) => {
  const { page } = req.query; 
  const limit = 10;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    const category = await Category.findOne({ slug: 'dien-thoai' });
    if (!category) {
      return res.status(404).json({
        success: false,
        err: 'Lỗi',
        msg: 'Không tìm thấy danh mục',
        status: 404
      });
    }

    const response = await GetPhoneVariantsService.getPhoneVariants(page, limit);

    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi',
        status: 400,
      });
    }

    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(response.response.total / limit);

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      data: response.response, 
      pagination: {
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error('Error in getPhoneByVariants:', error);
    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Error: ' + error.message,
      status: 500,
    });
  }
};

module.exports = { getPhoneByVariants };
