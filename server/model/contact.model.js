// models/Contact.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const contactSchema = new Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    ref: 'users',  // Tham chiếu đến bảng User
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
