const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Purchase = require('../models/Purchase'); // Assuming Purchase model is in the models directory
const Product = require('../models/Product'); // Assuming Product model is in the models directory
const User = require('../models/User'); // Assuming User model is in the models directory
const verifyToken = require('../middleware/verifyToken');

// POST - Create a new purchase
router.post('/create', verifyToken ,async (req, res) => {
  console.log((req.body))
  try {
    const { firebaseUid , productId, quantity, totalPrice, paymentMethod, shippingAddress } = req.body;
    console.log(productId)
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user exists
    const user = await User.findOne({firebaseUid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create the purchase
    const newPurchase = new Purchase({
      userId : user._id,
      productId,
      quantity,
      totalPrice,
      paymentMethod,
      shippingAddress,
      status: 'Pending',
       // Default status is "Pending"
    });

    // Save the purchase
    const savedPurchase = await newPurchase.save();

    // Send response back
    return res.status(201).json({ ok : true, message: 'Purchase created successfully', purchase: savedPurchase });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  
});


router.get('/userpurchase' ,async (req, res) => {
  try {
    const { uid ,page = 1, limit = 10} = req.query;
    console.log(req.query);
    // Check if user exists
    const user = await User.findOne({firebaseUid : uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const purchases = await Purchase.find({ userId: user._id }) .populate('productId')
    .limit(limit * 1) // Limit results to the page size
    .skip((page - 1) * limit) // Skip results based on page number
    .exec();

    const purchasesw = await Purchase.find({ userId: user._id }) .populate('productId');
    const total = await Purchase.countDocuments({ userId : user._id });
    let totalAmountSpent = purchasesw.reduce((total, purchase) => total + purchase.totalPrice, 0);


   
    return res.status(201).json({ ok : true, message: 'Purchase find successfully',  purchases,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalPurchases: total,
      totalAmountSpent
    });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  
});

module.exports = router;
