const Inbound = require('../../../model/inboundShipments.model');
const ProductModel = require('../../../model/product_v2');
const SupplierModel = require('../../../model/suppliers.model');

const add = async (req, res) => {

    try {
        const newInbound = new Inbound({
            product_id: req.body.inbound_product,
            inbound_description: req.body.inbound_description,
            inbound_quantity: req.body.inbound_quantity,
            inbound_price: req.body.inbound_price,
            inbound_supplier: req.body.inbound_supplier,
        });
        await newInbound.save();         
        return res.status(201).json({
            success: true,
            err: 0,
            msg: 'Lô hàng mới đã được thêm thành công',
            status: 201,
            product: newInbound,

        });
    } catch (error) {
        console.error('Lỗi khi thêm lô hàng:', error);
        return res.status(500).json({
            success: false,
            err: 1,
            msg: 'Có lỗi xảy ra khi thêm lô hàng',
            status: 500,
            error: error.message,
        });
    }
};

const getAllProductController = async (req, res) => {
    try {

        const products = await ProductModel.find({ status: { $ne: 'disable' } }).exec();

        const productReady = products.map(product => ({
            product: product._id,
            name: product.product_name,
            _id: product._id
        }));

        res.status(200).json({ productReady });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getAllSupplierController = async (req, res) => {
    try {

        const suppliers = await SupplierModel.find({ status: { $ne: 'disable' } }).exec();

        const supplierReady = suppliers.map(supplier => ({
            supplier: supplier._id,
            name: supplier.name,
            _id: supplier._id
        }));

        res.status(200).json({ supplierReady });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    add,
    getAllProductController,
    getAllSupplierController
};
