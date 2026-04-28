const mongoose = require('mongoose');

const orderSubSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: String,

  // ✅ ONE USER → MANY ORDERS
  orders: [orderSubSchema]
});

module.exports = mongoose.model('User', userSchema);