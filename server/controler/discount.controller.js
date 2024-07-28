'use strict'
//module
const discountService = require('../services/discount.service');




const discountController ={
    createDiscount : async (req, res) => {
        try {
            const discountData = req.body;
        
            // Call the service to create a discount
            const newDiscount = await discountService.createDiscount(discountData);
        
            // Send a successful response
            res.status(201).json(newDiscount);
          } catch (error) {
            console.error('Error creating discount:', error.message);
            res.status(400).json({ error: error.message }); // Respond with appropriate status and error message
          }
      },

      getAllDiscounts : async (req, res) => {
        try {
          const discounts = await discountService.getAllDiscounts();
          res.status(200).json(discounts);
          
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      getDiscountById : async (req, res) => {
        try {
          const discount = await discountService.getDiscountById(req.params.id);
          if (!discount) {
            return res.status(404).json({ error: 'Discount not found' });
          }
          res.status(200).json(discount);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      updateDiscount : async (req, res) => {
        try {
          const discount = await discountService.updateDiscount(req.params.id, req.body);
          if (!discount) {
            return res.status(404).json({ error: 'Discount not found' });
          }
          res.status(200).json(discount);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      },

      deleteDiscount : async (req, res) => {
        try {
          const discount = await discountService.deleteDiscount(req.params.id);
          if (!discount) {
            return res.status(404).json({ error: 'Discount not found' });
          }
          res.status(200).json({ message: 'Discount deleted successfully' });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },
}

module.exports = discountController