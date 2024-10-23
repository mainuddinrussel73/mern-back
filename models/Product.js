const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true 
  },
  imageUrl: { type: String },
  description: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0 
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

module.exports = mongoose.model('Product', productSchema);
