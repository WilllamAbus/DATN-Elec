const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    status: { type: String, default: 'active' },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
    },
    categoryid: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true,
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
        type: String,
        default: "chưa giảm giá"
    },
    rating: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
