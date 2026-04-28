const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

// CREATE ORDER
router.post('/', async (req, res) => {
  try {
    const { user, products, totalAmount } = req.body;

    // ✅ Save in Orders collection
    const newOrder = await Order.create({
      user,
      products,
      totalAmount
    });

    // ✅ ALSO SAVE INSIDE USER (ONE → MANY)
    await User.findByIdAndUpdate(user, {
      $push: {
        orders: {
          products,
          totalAmount
        }
      }
    });

    res.json(newOrder);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDERS
router.get('/', async (req, res) => {
  const orders = await Order.find()
    .populate('user')
    .populate('products');

  res.json(orders);
});

module.exports = router;