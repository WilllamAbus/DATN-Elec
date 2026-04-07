const Product_v2 = require("../model/product-v2.model");
const _Category = require("../model/catgories.model");
const _Discount = require("../model/discount.model");
const _Format = require("../model/formatShopping.model");
const _Condition = require("../model/condition-shop.model");
const _Brand = require("../model/brands.model");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const serviceAccount = require("../config/serviceAccount.json");
dotenv.config();
const { v4: uuidv4 } = require("uuid");

const STORE_BUCKET = process.env.STORE_BUCKET;
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORE_BUCKET,
  });
}

const storage = admin.storage();
const bucket = storage.bucket();

const productService = {
  uploadImagesToFirebase: async (images) => {
    const imageUrls = [];

    for (const image of images) {
      if (!Buffer.isBuffer(image.buffer)) {
        throw new Error("Invalid image data");
      }

      const fileName = `${uuidv4()}-${Date.now()}-${image.originalname}`;
      const file = bucket.file(
        `products/${fileName}`,
        `productAuction/${fileName}`
      );

      try {
        await file.save(image.buffer, {
          metadata: {
            contentType: image.mimetype,
          },
        });
        await file.makePublic();

        const imageURL = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(file.name)}?alt=media`;

        imageUrls.push(imageURL);
      } catch (err) {
        console.error("Error uploading image to Firebase Storage:", err);
        throw new Error("Failed to upload image");
      }
    }

    return imageUrls;
  },
  createProductV2: async (productData, images) => {
    const imageUrls = await uploadImagesToFirebase(images);

    const newProduct = new Product({
      product_name: productData.product_name,
      product_imgage: imageUrls,
      product_description: productData.product_description,
      product_attributes: productData.product_attributes,
      product_type: productData.product_type,
      product_condition: productData.product_condition,
      product_format: productData.product_format,
      product_discount: productData.product_discount,
      product_quantity: productData.product_quantity,
      product_price: productData.product_price,
    });
    await newProduct.save();
    await populateCate(newProduct);
    await populateCondition(newProduct);
    await populateFormatShopping(newProduct);
    await populateDiscount(newProduct);
    await populateBrands(newProduct);
    return newProduct;
  },
  edditProductV2: async (id, updatedData, newImages) => {
    try {
      const product = await Product_v2.findById(id);

      if (!product) {
        throw new Error("Product not found");
      }
      if (newImages && newImages.length > 0) {
        const imageUrls = await uploadImagesToFirebase(newImages);
        product.product_imgage = imageUrls;
      }
      product.product_name = updatedData.product_name || product.product_name;
      product.product_description =
        updatedData.product_description || product.product_description;
      product.product_attributes =
        updatedData.product_attributes || product.product_attributes;
      product.product_type = updatedData.product_type || product.product_type;
      product.product_condition =
        updatedData.product_condition || product.product_condition;
      product.product_format =
        updatedData.product_format || product.product_format;
      product.product_discount =
        updatedData.product_discount || product.product_discount;
      product.product_quantity =
        updatedData.product_quantity || product.product_quantity;
      product.product_price =
        updatedData.product_price || product.product_price;
      await product.save();
      await populateCate(product);
      await populateCondition(product);
      await populateFormatShopping(product);
      await populateDiscount(product);

      return product;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  },
  getAllProduct: async (page = 1, pageSize = 4) => {
    const limit = parseInt(pageSize, 4);
    const skip = (parseInt(page, 4) - 1) * limit;

    try {
      const products = await Product_v2.find({ status: { $ne: "disable" } })
        .limit(limit)
        .skip(skip)
        .exec();

      const totalProducts = await Product_v2.countDocuments({
        status: { $ne: "disable" },
      });
      const totalPages = Math.ceil(totalProducts / limit);

      return {
        products,
        pagination: {
          page: parseInt(page, 10),
          pageSize: limit,
          totalProducts,
          totalPages,
        },
      };
    } catch (err) {
      console.error("Error fetching products:", err);
      throw new Error("Failed to fetch products");
    }
  },

  softDeleteProduct: async (id) => {
    try {
      const offset = 7 * 60 * 60 * 1000;
      const now = new Date(nowUtc.getTime() + offset);

      const softDeleteProduct = await Product_v2.findByIdAndUpdate(
        id,
        { status: "disable", disabledAt: now },

        { new: true }
      );
      return softDeleteProduct;
    } catch (error) {
      console.error(error);
    }
  },
  deletedListProduct: async (page = 1, pageSize = 4) => {
    try {
      // Validate page and pageSize parameters
      const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
      const size = parseInt(pageSize, 4) > 0 ? parseInt(pageSize, 4) : 4;

      // Calculate the number of documents to skip
      const skip = (pageNumber - 1) * size;

      // Fetch the paginated list of deleted discounts
      const [deletedProduct, totalCount] = await Promise.all([
        Product_v2.find({ status: "disable" }) // Assuming "disable" status indicates deletion
          .skip(skip)
          .limit(size),
        Product_v2.countDocuments({ status: "disable" }),
      ]);

      // Return the list of deleted discounts along with pagination info
      return {
        deletedProduct: Array.isArray(deletedProduct) ? deletedProduct : [],
        pagination: [
          {
            page: pageNumber,
            pageSize: size,
            total: totalCount,
            totalPages: Math.ceil(totalCount / size),
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching deleted discounts:", error);
      throw new Error("Failed to fetch deleted discounts");
    }
  },
  restore: async (id) => {
    try {
      const restore = await Product_v2.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
      );
      return restore;
    } catch (error) {
      console.error(error);
    }
  },
  getProductById: async (id) => {
    return await Product_v2.findById(id);
  },
  searchProducts: async (keyword) => {
    try {
      // Tìm kiếm sản phẩm theo từ khóa trong tên sản phẩm
      const products = await Product_v2.find({
        product_name: { $regex: keyword, $options: "i" },
      })
        .select("product_name product_slug") // Chỉ lấy tên và slug sản phẩm để trả về gợi ý
        .limit(10); // Giới hạn số lượng gợi ý

      return products;
    } catch (error) {
      throw new Error("Error fetching search results");
    }
  },
  getSuggestions: async (query, limit = 4) => {
    try {
      const suggestions = await Product_v2.find({
        product_name: { $regex: query, $options: "i" },
        status: { $ne: "disable" },
      })
        .select("product_name product_slug")
        .limit(limit)
        .exec();

      return suggestions;
    } catch (err) {
      console.error("Error fetching product suggestions:", err);
      throw new Error("Failed to fetch product suggestions");
    }
  },
  searchProductAdmin: async (query, page = 1, pageSize = 4) => {
    const limit = parseInt(pageSize, 4); // Number of products per page
    const skip = (parseInt(page, 10) - 1) * limit; // Number of products to skip

    try {
      // Build the search query
      const searchQuery = {
        $or: [
          { product_name: { $regex: query, $options: "i" } }, // Case-insensitive search for product name
          { product_description: { $regex: query, $options: "i" } }, // Case-insensitive search for product description
        ],
        status: { $ne: "disable" }, // Exclude disabled products
      };

      // Fetch products based on the search query
      const products = await Product_v2.find(searchQuery)
        .limit(limit)
        .skip(skip)
        .exec();

      const totalProducts = await Product_v2.countDocuments(searchQuery); // Get the total number of matching products
      const totalPages = Math.ceil(totalProducts / limit);

      return {
        products,
        pagination: {
          page: parseInt(page, 10),
          pageSize: limit,
          totalProducts,
          totalPages,
        },
      };
    } catch (err) {
      console.error("Error searching products:", err);
      throw new Error("Failed to search products");
    }
  },
  populateCate: async (product) => {
    return await product
      .populate({
        path: "product_type",
        model: "Categories",
        match: { status: { $ne: "disable" } }, // Apply filter to exclude disabled categories
      })
      .exec();
  },
  populateCondition: async (product) => {
    return await product
      .populate({
        path: "product_condition",
        model: "conditionShopping",
        match: { status: { $ne: "disable" } }, // Apply filter
      })
      .exec();
  },
  populateFormatShopping: async (product) => {
    return await product
      .populate({
        path: "product_format",
        model: "formatShopping",
        match: { status: { $ne: "disable" } }, // Apply filter
      })
      .exec();
  },
  populateCate: async (product) => {
    return await product
      .populate({
        path: "product_discount",
        model: "discounts",
        match: { status: { $ne: "disable" } }, // Apply filter
      })
      .exec();
  },
  populateBrands: async (product) => {
    return await product
      .populate({
        path: " product_brands",
        model: "brands",
        match: { status: { $ne: "disable" } }, // Apply filter
      })
      .exec();
  },
  deleteProduct: async (id) => {
    try {
      const deleteProduct = await Product_v2.findByIdAndDelete(id);
      return deleteProduct;
    } catch (error) {
      console.error("Error in updateDiscount service:", error.message);
      throw new Error(error.message);
    }
  },

  getAllConditionService: async () => {
    try {
      const conditions = await _Condition.find({}).exec();
      const conditionReady = conditions.map((condition) => ({
        condition: condition._id,
        name: condition.name,
        _id: condition._id,
      }));
      return { conditionReady };
    } catch (error) {
      console.error("Error fetching conditions:", error);
      throw new Error("Server error");
    }
  },

  getAllFormatsService: async () => {
    try {
      const formats = await _Format.find({}).exec();
      const formatReady = formats.map((format) => ({
        format: format._id,
        name: format.name,
        _id: format._id,
      }));
      return { formatReady };
    } catch (error) {
      console.error("Error fetching formats:", error);
      throw new Error("Server error");
    }
  },

  getAllDiscountsService: async () => {
    try {
      const discounts = await _Discount.find({}).exec();
      const discountReady = discounts.map((discount) => ({
        discount: discount._id,
        discountPercent: discount.discountPercent,
        _id: discount._id,
      }));
      return { discountReady };
    } catch (error) {
      console.error("Error fetching discounts:", error);
      throw new Error("Server error");
    }
  },

  getAllCategoriesService: async () => {
    try {
      const categories = await _Category.find({}).exec();
      const cateReady = categories.map((category) => ({
        category: category._id,
        name: category.name,
        _id: category._id,
      }));
      return { cateReady };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Server error");
    }
  },
  getAllBrandService: async () => {
    try {
      const brand = await _Brand.find({}).exec();
      const brandReady = brand.map((brands) => ({
        brands: brands._id,
        name: brands.name,
        _id: brands._id,
      }));
      return { brandReady };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Server error");
    }
  },

  incrementProductView: async (req, res) => {
    try {
      const { id } = req.params;

      // Tìm sản phẩm theo ID
      const product = await Product_v2.findById(id);

      if (!product) {
        console.error("Product not found with id:", id);
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Tăng số lượng lượt xem của sản phẩm
      product.product_view = (product.product_view || 0) + 1;
      await product.save();

      res.status(200).json({
        success: true,
        message: "View count incremented successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error during view count increment:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  filterProductsByPrice: async (price) => {
    let minPrice = 0; // Default minimum price
    let maxPrice;

    switch (price) {
      case "price-0":
        maxPrice = 500000; // Up to 500000
        break;
      case "price-1":
        minPrice = 500000;
        maxPrice = 1000000; // From 500000 to below 1000000
        break;
      case "price-2":
        minPrice = 1000000;
        maxPrice = 3000000; // From 1000000 to below 3000000
        break;
      case "price-3":
        minPrice = 3000000;
        maxPrice = 5000000; // From 3000000 to below 5000000
        break;
      case "price-4":
        minPrice = 5000000; // Above 5000000
        break;
      default:
        throw new Error("Invalid price range");
    }

    const query = { price: { $gte: minPrice } };
    if (maxPrice) {
      query.price.$lt = maxPrice;
    }

    return modelProduct.find(query);
  },

 
};

module.exports = productService;
