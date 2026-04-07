const modelProduct = require("../../../model/product_v2");
const ProductVariant = require('../../../model/product_v2/productVariant');
const ImageVariant = require('../../../model/product_v2/imagevariant'); 
const Role = require('../../../model/role.model');
const { RESPONSE_MESSAGES_CRUD, STATUS_CODES } = require('./constants');

const deleteVariant = async (req, res) => {
    try {
        // Kiểm tra vai trò admin
        const adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
            return res.status(STATUS_CODES.SERVER_ERROR).json({
                success: false,
                err: 1,
                msg: RESPONSE_MESSAGES_CRUD.ADMIN_ROLE_NOT_FOUND,
                status: STATUS_CODES.SERVER_ERROR
            });
        }
        if (!req.user || !Array.isArray(req.user.roles)) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                err: 1,
                msg: RESPONSE_MESSAGES_CRUD.USER_ACCESS_DENIED,
                status: 403
            });
        }
        const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());
        if (!isAdmin) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                err: 1,
                msg: RESPONSE_MESSAGES_CRUD.ACCESS_DENIED,
                status: STATUS_CODES.FORBIDDEN
            });
        }

        const variantId = req.params.variantId;
        if (!variantId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                err: 1,
                msg: RESPONSE_MESSAGES_CRUD.INVALID_VARIANT_ID,
                status: STATUS_CODES.BAD_REQUEST
            });
        }
        

        // Tìm và xoá biến thể trong ProductVariant
        const variantToDelete = await ProductVariant.findByIdAndDelete(variantId);
        if (!variantToDelete) {
          console.error(`Không tìm thấy biến thể với ID: ${variantId}`); // Thêm dòng này để kiểm tra
          return res.status(STATUS_CODES.NOT_FOUND).json({
              success: false,
              err: 1,
              msg: RESPONSE_MESSAGES_CRUD.VARIANT_NOT_FOUND,
              status: STATUS_CODES.NOT_FOUND
          });
      }
      
        await ImageVariant.deleteMany({ productVariant: variantId });
        await modelProduct.updateOne(
            { variants: variantId },
            { $pull: { variants: variantId } }
        );

        res.status(STATUS_CODES.SUCCESS_DELETE).json({
            success: true,
            err: 0,
            msg: RESPONSE_MESSAGES_CRUD.SUCCESS_DELETE,
            status: STATUS_CODES.SUCCESS_DELETE,
            data: variantToDelete
        });
    } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.SERVER_ERROR).json({
            success: false,
            err: 1,
            msg: RESPONSE_MESSAGES_CRUD.SERVER_ERROR,
            status: STATUS_CODES.SERVER_ERROR,
            error: error.message
        });
    }
};

module.exports = {
    deleteVariant,
};
