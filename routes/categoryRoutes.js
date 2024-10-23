const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const verifyAdmin = require('../middleware/verifyAdmin');
const { messaging } = require('firebase-admin');

// Fetch all categories
router.get('/', async (req, res) => {
  try {
      
    const categories = await Category.find();
    res.status(200).json({ ok: true, data: categories });
  } catch (error) {
      console.error('Error fetching category :', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// CREATE a new category
router.post('/create', verifyAdmin, async (req, res) => {
  try {
   
      const newCategory = new Category(req.body.data.categoryForm);
      await newCategory.save();
      res.status(201).json(newCategory);
    
   
  } catch (err) {
    res.status(500).json({  err });
  }
});

router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {categoryForm} = req.body.data;
    // Find the product by ID and update its details
    const updatedCategory = await Category.findByIdAndUpdate(id, categoryForm, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete product (Admin only)
router.delete('/:id',verifyAdmin, async (req, res) => {
  try {
    console.log(req.params.id);

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category' });
  }
});

module.exports = router;
