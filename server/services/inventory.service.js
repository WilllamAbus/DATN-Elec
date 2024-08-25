'use strict'

const _Product_v2 = require('../model/product-v2.model')
const _Supplier = require("../model/suppliers.model")
const _Inventory = require('../model/inventory.model')


const inventoryService = {
    createInventory:async(inventoryData)=>{
        const inventory = new _Inventory({
            product: inventoryData.product,
            quantity: inventoryData.quantity,
            location: inventoryData.location,
            restockLevel: inventoryData.restockLevel,
            restockDate: inventoryData.restockDate,
            batchNumber: inventoryData.batchNumber,
            batchDate: inventoryData.batchDate,
            supplier: inventoryData.supplier,
            reservations: inventoryData.reservations,
            auctionQuantity: inventoryData.auctionQuantity,
    
          });
    
          // Save the new Inventory document
          await inventory.save();

          await populateProductV2(inventory);
          await populateSupplier(inventory);
          return inventory
    },
    editInventory : async (inventoryId, updatedData) => {
        try {
            // Find the inventory document by ID and update it with the new data
            const inventory = await _Inventory.findByIdAndUpdate(
                inventoryId, // The ID of the inventory to be updated
                {
                    $set: {
                        product: updatedData.product,
                        quantity: updatedData.quantity,
                        location: updatedData.location,
                        restockLevel: updatedData.restockLevel,
                        restockDate: updatedData.restockDate,
                        batchNumber: updatedData.batchNumber,
                        batchDate: updatedData.batchDate,
                        supplier: updatedData.supplier,
                        reservations: updatedData.reservations,
                        auctionQuantity: updatedData.auctionQuantity,
                    }
                },
                { new: true } // Return the updated document
            );
    
            if (!inventory) {
                throw new Error('Inventory not found');
            }
    
            // Populate referenced fields after update
            await populateProductV2(inventory);
            await populateSupplier(inventory);
    
            return inventory;
        } catch (error) {
            console.error('Error updating inventory:', error);
            throw new Error('Failed to update inventory');
        }
    },
    

    populateProductV2: async (inventory) => {
        return await inventory.populate({
            path: 'product',
            model:'product_v2',
            match: { status: { $ne: 'disable' } } // Apply filter to exclude disabled categories
        }).exec();
    },
    populateSupplier: async(inventory)=>{
        return await inventory.populate({
            path: 'supplier',
            model: 'Supplier',
            match: { status: { $ne: "disable" } } // Apply filter
          }).exec();;
    },
    getInventoryById: async (id) => {
        return await _Inventory.findById(id)
      },
      deletedInventory: async (id) => {
    
        try {
         
            const deleteInventory = await _Inventory.findByIdAndDelete(id);
            return deleteInventory
        } catch (error) {
            console.error("Error in updateDiscount service:", error.message);
            throw new Error(error.message);
        }
        
      },
    getAllInventory: async(page = 1, pageSize = 4)=>{
        const limit = parseInt(pageSize, 4); // Number of products per page
        const skip = (parseInt(page, 4) - 1) * limit; // Number of products to skip
    
        try {
            const inventory = await _Inventory.find({ status: { $ne: 'disable' } }) // Filter out disabled products
                .limit(limit)
                .skip(skip)
                .exec();
    
            const totalInventory = await _Inventory.countDocuments({ status: { $ne: 'disable' } }); // Get the total number of products
            const totalPages = Math.ceil(totalInventory / limit);
    
            return {
                inventory,
                pagination: {
                    page: parseInt(page, 10),
                    pageSize: limit,
                    totalInventory,
                    totalPages,
                },
            };
        } catch (err) {
            console.error('Error fetching products:', err);
            throw new Error('Failed to fetch products');
        }
    },

    softDeleteInventory: async (id) => {
        try {
            // const adminRole = await Role.findOne({ name: 'admin' });
    
    
            // if (!adminRole) {
            //     return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            // }
    
    
            // const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());
    
            // if (!isAdmin) {
            //     return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể cập nhật sản phẩm" });
            // }
            const nowUtc = new Date();
        
            // Chuyển đổi thời gian UTC về múi giờ Việt Nam
            // Múi giờ Việt Nam là UTC + 7 giờ
            const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
            const now = new Date(nowUtc.getTime() + offset);
        
            const softDeleteInventory = await _Inventory.findByIdAndUpdate(
                id,
                { status: "disable",   disabledAt: now },
                
                { new: true }
              );
          return softDeleteInventory
        } catch (error) {
          console.error(error);
        }
      },
      deletedListInventory:async (page = 1, pageSize = 4) => {
        try {
          // Validate page and pageSize parameters
          const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
          const size = parseInt(pageSize, 4) > 0 ? parseInt(pageSize, 4) : 4;
      
          // Calculate the number of documents to skip
          const skip = (pageNumber - 1) * size;
      
          // Fetch the paginated list of deleted discounts
          const [deletedInventory, totalCount] = await Promise.all([
            _Inventory.find({ status: "disable" })  // Assuming "disable" status indicates deletion
                      .skip(skip)
                      .limit(size),
            _Inventory.countDocuments({ status: "disable" })
          ]);
          
          // Return the list of deleted discounts along with pagination info
          return {
            deletedInventory: Array.isArray(deletedInventory) ? deletedInventory : [],
            pagination: [{
              page: pageNumber,
              pageSize: size,
              total: totalCount,
              totalPages: Math.ceil(totalCount / size),
            }]
          };
        } catch (error) {
          console.error("Error fetching deleted discounts:", error);
          throw new Error("Failed to fetch deleted discounts");
        }
    },
      restore: async (id) => {
        try {
          
            const restore =  await _Inventory.findByIdAndUpdate(
                id,
                { status: "active" },
                { new: true }
              );
         return restore
        } catch (error) {
          console.error(error);
        }
      },
    getAllProductsV2Service : async () => {
        try {
            // Fetch and populate referenced fields
            const products = await _Product_v2.find({})
                .populate({
                    path: 'product_type',
                    model: 'categories', 
                    match: { status: { $ne: "disable" } }// Ensure this matches the model name for categories
                })
                .populate({
                    path: 'product_brands',
                    model: 'Brand', 
                    match: { status: { $ne: "disable" } }// Ensure this matches the model name for Brand
                })
                .populate({
                    path: 'product_discount',
                    model: 'discounts', 
                    match: { status: { $ne: "disable" } }// Ensure this matches the model name for discounts
                })
                .populate({
                    path: 'product_format',
                    model: 'formatShopping', 
                    match: { status: { $ne: "disable" } }// Ensure this matches the model name for formatShopping
                })
                .populate({
                    path: 'product_condition',
                    model: 'conditionShopping',
                    match: { status: { $ne: "disable" } } // Ensure this matches the model name for conditionShopping
                })
                .exec();
    
            // Format the data
            const productsReady = products.map(product => {
                // Extract attributes dynamically
            const { color, size, weight , height, memory} = product.product_attributes || {};
    
                return {
                    productId: product._id,
                    productName: product.product_name,
                    productImage: product.product_imgage,
                    productDescription: product.product_description,
                    productSlug: product.product_slug,
                    productType: product.product_type.map(category => ({
                        categoryId: category._id,
                        categoryName: category.name, // Replace `name` with the actual field you need
                    })),
                    productBrands: {
                        brandId: product.product_brands._id,
                        brandName: product.product_brands.name, // Replace `name` with the actual field you need
                    },
                    productDiscount: {
                        discountId: product.product_discount._id,
                        discountValue: product.product_discount.value, // Replace `value` with the actual field you need
                    },
                    productFormat: {
                        formatId: product.product_format._id,
                        formatName: product.product_format.name, // Replace `name` with the actual field you need
                    },
                    productCondition: {
                        conditionId: product.product_condition._id,
                        conditionName: product.product_condition.name, // Replace `name` with the actual field you need
                    },
                    productQuantity: product.product_quantity,
                    productRatingAvg: product.product_ratingAvg,
                    productView: product.product_view,
                    productPrice: product.product_price,
                    productAttributes: {
                        color, // Specific attribute
                        size,  // Specific attribute
                        weight,
                        height ,
                        memory// Specific attribute
                    },
                    isActive: product.isActive,
                    status: product.status,
                    disabledAt: product.disabledAt,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                };
            });
    
            // Return the formatted data
            return { productsReady };
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Server error');
        }
    },
    getAllSupplierService : async () => {
        try {
            const supplier = await _Supplier.find({}).exec();
            const supplierReady = supplier.map(suplier => ({
                brands: suplier._id,
                name: suplier.name,
                phone:suplier.phone,
                description:suplier.description,
                address:suplier.address
               
            }));
            return { supplierReady };
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Server error');
        }
    },

    searchInventoryAdmin: async(query, page = 1, pageSize = 5)=>{
        const limit = parseInt(pageSize, 5); // Number of products per page
        const skip = (parseInt(page, 5) - 1) * limit; // Number of products to skip
    
        try {
            // Build the search query
            const searchQuery = {
                $or: [
                    { 'location.warehouse': { $regex: query, $options: 'i' } }, // Case-insensitive search in warehouse
                    { 'location.section': { $regex: query, $options: 'i' } }, // Case-insensitive search in section
                    { 'location.aisle': { $regex: query, $options: 'i' } }, // Case-insensitive search in aisle
                    { 'location.shelf': { $regex: query, $options: 'i' } }, // Case-insensitive search in shelf
                    { 'location.bin': { $regex: query, $options: 'i' } } // Case-insensitive search in bin
                ],
                status: { $ne: 'disable' } // Exclude disabled products
            };
    
            // Fetch products based on the search query
            const inventory = await _Inventory.find(searchQuery)
                .limit(limit)
                .skip(skip)
                .exec();
    
            const totalInventory = await _Inventory.countDocuments(searchQuery); // Get the total number of matching products
            const totalPages = Math.ceil(totalInventory / limit);
    
            return {
                inventory,
                pagination: {
                    page: parseInt(page, 10),
                    pageSize: limit,
                    totalInventory,
                    totalPages,
                },
            };
        } catch (err) {
            console.error('Error searching products:', err);
            throw new Error('Failed to search products');
        }
    },

    getSuggestions: async (query, limit = 5) => {
        try {
            // Build the search query for suggestions
            const searchQuery = {
                $or: [
                    { 'product': { $regex: query, $options: 'i' } }, // Case-insensitive search in product names
                    { 'batchNumber': { $regex: query, $options: 'i' } }, // Case-insensitive search in batch numbers
                    { 'location.warehouse': { $regex: query, $options: 'i' } }, // Case-insensitive search in warehouse
                    { 'location.section': { $regex: query, $options: 'i' } }, // Case-insensitive search in section
                    { 'location.aisle': { $regex: query, $options: 'i' } }, // Case-insensitive search in aisle
                    { 'location.shelf': { $regex: query, $options: 'i' } }, // Case-insensitive search in shelf
                    { 'location.bin': { $regex: query, $options: 'i' } } // Case-insensitive search in bin
                ],
                status: { $ne: 'disable' } // Exclude disabled products
            };
    
            // Fetch suggestions based on the search query
            const suggestions = await _Inventory.find(searchQuery)
                .limit(limit) // Limit the number of suggestions
                .exec();
    
            // Return the suggestions
            return suggestions.map(suggestion => ({
                id: suggestion._id,
                product: suggestion.product,
                batchNumber: suggestion.batchNumber,
                location: suggestion.location,
            }));
        } catch (err) {
            console.error('Error fetching suggestions:', err);
            throw new Error('Failed to fetch suggestions');
        }
    },



    


}


module.exports  = inventoryService