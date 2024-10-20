const modelProductAuction = require("../../../model/productAuction/productAuction");
const Role = require('../../../model/role.model');
const mongoose = require('mongoose');
const { ERRORS, SUCCESS, STATUS_CODES } = require('./constants');

const softDelete = async (req, res) => {
  try {
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        err: 1,
        msg: ERRORS.INVALID_PRODUCT_ID,
        status: STATUS_CODES.BAD_REQUEST
      });
    }
    const product = await modelProductAuction.findById(id);
    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        err: 1,
        msg: ERRORS.PRODUCT_NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND
      });
    }
    if (product.status === 'disable') {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        err: 1,
        msg: ERRORS.PRODUCT_ALREADY_DELETED,
        status: STATUS_CODES.BAD_REQUEST
      });
    }
    const softDeletedProduct = await modelProductAuction.findByIdAndUpdate(id, { status: 'disable' }, { new: true });
    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      err: 0,
      msg: SUCCESS.PRODUCT_DELETED,
      status: STATUS_CODES.SUCCESS,
      data: softDeletedProduct
    });

  } catch (error) {
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      err: 1,
      msg: ERRORS.SERVER_ERROR,
      status: STATUS_CODES.SERVER_ERROR,
      error: error.message
    });
  }
}

module.exports = {
  softDelete,
};
