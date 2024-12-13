const modelProduct = require("../../../model/product_v2");
const ProductVariant = require('../../../model/product_v2/productVariant'); 
const ImageVariant = require('../../../model/product_v2/imagevariant'); 
const Role = require('../../../model/role.model');
const { RESPONSE_MESSAGES_CRUD, STATUS_CODES } = require('./constants'); 

const hardDelete = async (req, res) => {
    try {
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
        const id = req.params.id;
        if (!id) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                err: 1,
                msg: RESPONSE_MESSAGES_CRUD.INVALID_PRODUCT_ID,
                status: STATUS_CODES.BAD_REQUEST
            });
        }
        const productToDelete = await modelProduct.findById(id);
        if (!productToDelete) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                err: 1,
                msg: RESPONSE_MESSAGES_CRUD.PRODUCT_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND
            });
        }
        if (productToDelete.variants && productToDelete.variants.length > 0) {
            const variantIds = productToDelete.variants.map(variantId => variantId.toString());
            await ProductVariant.deleteMany({ _id: { $in: variantIds } });
            await ImageVariant.deleteMany({ productVariant: { $in: variantIds } });
        }
        const hardDeletedProduct = await modelProduct.findByIdAndDelete(id);
        if (!hardDeletedProduct) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                err: 1,
                msg: RESPONSE_MESSAGES_CRUD.PRODUCT_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND
            });
        }
        res.status(STATUS_CODES.SUCCESS_DELETE).json({
            success: true,
            err: 0,
            msg: RESPONSE_MESSAGES_CRUD.SUCCESS_DELETE,
            status: STATUS_CODES.SUCCESS_DELETE,
            data: hardDeletedProduct
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
    hardDelete,
};
