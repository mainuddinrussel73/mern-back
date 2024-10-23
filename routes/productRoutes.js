const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Import your Category model
const Product = require('../models/Product');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/product/:id', verifyToken, async (req, res) => {
  try {
      const product = await Product.findById(req.params.id).populate('category', 'name');

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ ok: true, data: product });
  } catch (err) {
      console.error('Error fetching product details:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all products
router.get('/productsByCategory', async (req, res) => {
  const { category } = req.query;
  if (!category) {
      return res.status(400).json({ message: 'Category name is required' });
  }

  try {
      // Step 1: Find the category by name
      const categoryObj = await Category.find({ name:  category });

      if (categoryObj.length === 0) {
        return res.status(404).json({ message: 'No categories found' });
      }
      const products = await Product.find({ category: categoryObj[0]._id });
      res.status(200).json({ ok: true, data: products });
  } catch (error) {
      console.error('Error fetching products by category name:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
      
});

// Fetch all products
router.get('/', async (req, res) => {
  

  try {
      
      const products = await Product.find({});
      res.status(200).json({ ok: true, data: products });
  } catch (error) {
      console.error('Error fetching products by category name:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
      
});

// Add a new product (Admin only)
router.post('/create',verifyAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body.data.formData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product' });
  }
});

router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {formData} = req.body.data;
    console.log(formData);
    // Find the product by ID and update its details
    const updatedProduct = await Product.findByIdAndUpdate(id, formData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete product (Admin only)
router.delete('/:id',verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
