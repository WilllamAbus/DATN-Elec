'use strict'
//module
const voucherService = require('../services/voucher.service');




const voucherController ={
    createVoucher : async (req, res) => {
        try {
            const voucherData = req.body;
        
            // Call the service to create a discount
            const newVoucher = await voucherService.createVoucher(voucherData );
        
            // Send a successful response
            res.status(201).json(newVoucher);
          } catch (error) {
            console.error('Error creating discount:', error.message);
            res.status(400).json({ error: error.message }); // Respond with appropriate status and error message
          }
      },

      getAllVoucher : async (req, res) => {
        try {
          const voucher= await voucherService.getAllVoucher();
          res.status(200).json(voucher);
          
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      getVoucherById : async (req, res) => {
        try {
          const voucher = await voucherService.getVoucherById(req.params.id);
          if (!voucher) {
            return res.status(404).json({ error: 'Voucher not found' });
          }
          res.status(200).json(voucher);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      updateVoucher : async (req, res) => {
        try {
          const discount = await voucherService.updateVoucher(req.params.id, req.body);
          if (!discount) {
            return res.status(404).json({ error: 'Discount not found' });
          }
          res.status(200).json(discount);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      },

      deleteVoucher : async (req, res) => {
        try {
          const voucher = await voucherService.deleteVoucher(req.params.id);
          if (!voucher) {
            return res.status(404).json({ error: 'Voucher not found' });
          }
          res.status(200).json({ message: 'Voucher deleted successfully' });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },
}

module.exports = voucherController