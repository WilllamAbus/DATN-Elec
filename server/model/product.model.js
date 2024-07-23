const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa schema cho sản phẩm
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    quantity: {
        type: Number,
        required: true,
    },
    categoryid: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    weight: {
        type: Number,
        required: false,
    },
    brand: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    discount: {
        type: Number,
        default: 0  
      }
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
