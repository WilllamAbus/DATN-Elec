const modelVariant = require('../../../model/product_v2/productVariant');

const getAllColorVariant = async (req, res) => {
  try {
    const variants = await modelVariant.find({ 
      status: { $ne: 'disable' }, 
      'variant_attributes.k': 'Color' 
    }).select('variant_attributes'); 



    const colors = new Set();
    
    variants.forEach(variant => {
      const attributes = variant.variant_attributes || [];
      attributes.forEach(attr => {
        if (attr.k === 'Color') { 
          colors.add(attr.v); 
        }
      });
    });

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      colors: Array.from(colors),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Lỗi',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = { getAllColorVariant };
