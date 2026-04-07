const inventoryService = require('../services/inventory.service');

const inventoryController = {
    // createInventory: async (req, res) => {
    //     try {
    //         const inventoryData = req.body;
    //         const newInventory = await inventoryService.createInventory(inventoryData);
    //         res.status(201).json({ message: 'Inventory created successfully', data: newInventory });
    //     } catch (error) {
    //         console.error('Error creating inventory:', error);
    //         res.status(500).json({ message: 'Failed to create inventory', error: error.message });
    //     }
    // },

    // editInventory: async (req, res) => {
    //     try {
    //         const inventoryId = req.params.id;
    //         const updatedData = req.body;
    //         const updatedInventory = await inventoryService.editInventory(inventoryId, updatedData);
    //         res.status(200).json({ message: 'Inventory updated successfully', data: updatedInventory });
    //     } catch (error) {
    //         console.error('Error updating inventory:', error);
    //         res.status(500).json({ message: 'Failed to update inventory', error: error.message });
    //     }
    // },

    // getInventoryById: async (req, res) => {
    //     try {
    //         const inventoryId = req.params.id;
    //         const inventory = await inventoryService.getInventoryById(inventoryId);
    //         if (!inventory) {
    //             return res.status(404).json({ message: 'Inventory not found' });
    //         }
    //         res.status(200).json({ data: inventory });
    //     } catch (error) {
    //         console.error('Error fetching inventory:', error);
    //         res.status(500).json({ message: 'Failed to fetch inventory', error: error.message });
    //     }
    // },

    getAllInventory: async (req, res) => {
        try {
            const inventoryData = await inventoryService.getAllInventory();
            // Kiểm tra dữ liệu trước khi trả về
            if (!inventoryData || inventoryData.length === 0) {
                return res.status(404).json({
                    success: false,
                    err: 1,
                    msg: 'Không có dữ liệu tồn kho',
                    status: 404,
                });
            }
            
            return res.status(200).json({
                success: true,
                err: 0,
                msg: 'Lấy danh sách tồn kho thành công',
                status: 200,
                inventory: inventoryData,
            });
        } catch (error) {
            console.error('Error fetching inventory:', error);
            return res.status(500).json({
                success: false,
                err: 1,
                msg: 'Lấy danh sách tồn kho thất bại',
                status: 500,
                error: error.message,
            });
        }
    },

    // softDeleteInventory: async (req, res) => {
    //     try {
    //         const inventoryId = req.params.id;
    //         const deletedInventory = await inventoryService.softDeleteInventory(inventoryId);
    //         res.status(200).json({ message: 'Inventory soft deleted successfully', data: deletedInventory });
    //     } catch (error) {
    //         console.error('Error soft deleting inventory:', error);
    //         res.status(500).json({ message: 'Failed to soft delete inventory', error: error.message });
    //     }
    // },

    // deletedListInventory: async (req, res) => {
    //     try {
    //         const { page, pageSize } = req.query;
    //         const deletedInventories = await inventoryService.deletedListInventory(page, pageSize);
    //         res.status(200).json({ data: deletedInventories });
    //     } catch (error) {
    //         console.error('Error fetching deleted inventories:', error);
    //         res.status(500).json({ message: 'Failed to fetch deleted inventories', error: error.message });
    //     }
    // },

    // restoreInventory: async (req, res) => {
    //     try {
    //         const inventoryId = req.params.id;
    //         const restoredInventory = await inventoryService.restore(inventoryId);
    //         res.status(200).json({ message: 'Inventory restored successfully', data: restoredInventory });
    //     } catch (error) {
    //         console.error('Error restoring inventory:', error);
    //         res.status(500).json({ message: 'Failed to restore inventory', error: error.message });
    //     }
    // },

    // getAllProductsV2: async (req, res) => {
    //     try {
    //         const products = await inventoryService.getAllProductsV2Service();
    //         res.status(200).json({ data: products });
    //     } catch (error) {
    //         console.error('Error fetching products:', error);
    //         res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    //     }
    // },

    // getAllSuppliers: async (req, res) => {
    //     try {
    //         const suppliers = await inventoryService.getAllSupplierService();
    //         res.status(200).json({ data: suppliers });
    //     } catch (error) {
    //         console.error('Error fetching suppliers:', error);
    //         res.status(500).json({ message: 'Failed to fetch suppliers', error: error.message });
    //     }
    // },

    // searchInventoryAdmin: async (req, res) => {
    //     try {
    //         const { query, page, pageSize } = req.query;
    //         const searchResults = await inventoryService.searchInventoryAdmin(query, page, pageSize);
    //         res.status(200).json({ data: searchResults });
    //     } catch (error) {
    //         console.error('Error searching inventory:', error);
    //         res.status(500).json({ message: 'Failed to search inventory', error: error.message });
    //     }
    // },

    // getSuggestions: async (req, res) => {
    //     try {
    //         const { query, limit } = req.query;
    //         const suggestions = await inventoryService.getSuggestions(query, limit);
    //         res.status(200).json({ data: suggestions });
    //     } catch (error) {
    //         console.error('Error fetching suggestions:', error);
    //         res.status(500).json({ message: 'Failed to fetch suggestions', error: error.message });
    //     }
    // },

    // deleteInventory : async (req, res) => {
    //     try {
    //       const product = await inventoryService.deletedInventory(req.params.id);
    //       if (!product) {
    //         return res.status(404).json({ error: 'product not found' });
    //       }
    //       res.status(200).json({ message: 'Product deleted successfully' });
    //     } catch (err) {
    //       res.status(500).json({ error: err.message });
    //     }
    //   },
};

module.exports = inventoryController;