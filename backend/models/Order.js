const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // ✅ MANY PRODUCTS IN ONE ORDER
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  totalAmount: Number
});

module.exports = mongoose.model('Order', orderSchema);