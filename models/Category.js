const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, // Ensure each category name is unique
    trim: true // Trim whitespace from the name
  },
  description: { 
    type: String, 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Automatically set the date when a category is created
  },
  updatedAt: { 
    type: Date, 
    default: Date.now // Automatically set the date when a category is created
  }
});

module.exports = mongoose.model('Category', categorySchema);
