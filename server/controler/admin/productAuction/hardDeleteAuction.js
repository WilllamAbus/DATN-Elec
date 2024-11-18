const ProductAuction = require("../../../model/productAuction/productAuction");
const Role = require('../../../model/role.model');
const { ERRORS, STATUS_CODES, SUCCESS } = require('./constants');

const hardDeleteAuction = async (req, res) => {
    try {
        // Kiểm tra vai trò admin
        const adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
            return res.status(STATUS_CODES.SERVER_ERROR).json({
                success: false,
                err: 1,
                msg: ERRORS.ADMIN_NOT_FOUND,
                status: STATUS_CODES.SERVER_ERROR
            });
        }

        if (!req.user || !Array.isArray(req.user.roles)) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                err: 1,
                msg: ERRORS.USER_NO_ACCESS,
                status: STATUS_CODES.FORBIDDEN
            });
        }

        // Kiểm tra quyền admin
        const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());
        if (!isAdmin) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                err: 1,
                msg: ERRORS.ACCESS_DENIED,
                status: STATUS_CODES.FORBIDDEN
            });
        }

        const id = req.params.id;
        if (!id) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                err: 1,
                msg: ERRORS.INVALID_PRODUCT_ID,
                status: STATUS_CODES.BAD_REQUEST
            });
        }
        const productAuctionToDelete = await ProductAuction.findById(id);
        if (!productAuctionToDelete) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                err: 1,
                msg: ERRORS.PRODUCT_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND
            });
        }

        const hardDeletedProductAuction = await ProductAuction.findByIdAndDelete(id);
        if (!hardDeletedProductAuction) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                err: 1,
                msg: ERRORS.PRODUCT_NOT_FOUND,
                status: STATUS_CODES.NOT_FOUND
            });
        }

        res.status(STATUS_CODES.SUCCESS_DELETE).json({
            success: true,
            err: 0,
            msg: SUCCESS.PRODUCT_DELETED,
            status: STATUS_CODES.SUCCESS_DELETE,
            data: hardDeletedProductAuction
        });
    } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.SERVER_ERROR).json({
            success: false,
            err: 1,
            msg: ERRORS.SERVER_ERROR,
            status: STATUS_CODES.SERVER_ERROR,
            error: error.message
        });
    }
};

module.exports = {
    hardDeleteAuction,
};
