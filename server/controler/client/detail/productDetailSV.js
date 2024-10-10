const Product = require('../../../model/product_v2');
const ProductVariant = require('../../../model/product_v2/productVariant');
const Battery = require('../../../model/attributes/battery'); 
const Color = require('../../../model/attributes/color'); 
const CPU = require('../../../model/attributes/cpu'); 
const OperatingSystem = require('../../../model/attributes/operatingSystem'); 
const RAM = require('../../../model/attributes/ram'); 
const Screen = require('../../../model/attributes/screen'); 
const Storage = require('../../../model/attributes/storage'); 
const Inventory = require("../../../model/inventory/inventory.model");
const ProductDetailService = {
  getProductDetail: async (slug) => {
    try {
      const product = await Product.findOne({ 
          slug: slug,
          status: { $ne: 'disable' } 
        })
        .populate('product_type')
        .populate('product_brand')
        .populate('product_format')
        .populate('product_condition')
        .populate('product_supplier')

        .populate({
          path: 'variants',
          populate: [
            { path: 'battery', model: Battery }, 
            { path: 'color', model: Color }, 
            { path: 'cpu', model: CPU }, 
            { path: 'operatingSystem', model: OperatingSystem }, 
            { path: 'ram', model: RAM }, 
            { path: 'screen', model: Screen }, 
            { path: 'storage', model: Storage },
            {
              path: 'inventory',
              model: Inventory,
              select: 'quantityShelf quantityStock totalQuantity price totalPrice status createdAt updatedAt'
            }

          ]
        })
        .select('product_name image product_description slug product_discount product_brand variants product_format product_condition product_supplier product_quantity product_ratingAvg product_view product_price product_price_unit product_attributes weight_g isActive status disabledAt comments inventory')
        .lean();

      if (!product) {
        return {
          success: false,
          err: 1,
          msg: 'Không tìm thấy sản phẩm',
          status: 404,
        };
      }

      return {
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        data: product,
      };

    } catch (error) {
      return {
        success: false,
        err: -1,
        msg: 'Error: ' + error.message,
        status: 500,
      };
    }
  }
};

module.exports = ProductDetailService;
