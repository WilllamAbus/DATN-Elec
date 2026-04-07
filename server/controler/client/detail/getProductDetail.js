const Product = require('../../../model/product_v2');
const User = require('../../../model/users.model');
const ViewHistory = require('../../../model/product_v2/viewHistory');
const ProductDetailService = require('./productDetailSV');

const getProductDetail = async (req, res) => {
  const { slug } = req.params; 
  const { storage,color } = req.query; 
    const userId = req.user ? req.user.id : null; 
  
  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(200).json({
        success: true,
        variants: [],  
      });
    }

    const response = await ProductDetailService.getProductDetail(slug, storage,color,userId);

    if (!response.success) {
      return res.status(response.status).json({
        success: response.success,
        err: response.err,
        msg: response.msg,
        status: response.status,
      });
    }
 
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      data: response.data,
    });

  } catch (error) {
    console.error('Error in getProductDetail:', error);
    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Error: ' + error.message,
      status: 500,
    });
  }
};

module.exports = {
  getProductDetail,
};
