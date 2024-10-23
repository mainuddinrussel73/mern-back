const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, default: "" },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});
const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to user
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to product
  quantity: { type: Number, required: true, min: 1 },
  purchaseDate: { type: Date, default: Date.now },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Completed', 'Pending', 'Canceled'], // Only allow specific status values
    required: true 
  },
  paymentMethod: { 
      type: String, 
      required: true 
  },
  shippingAddress: { 
      type: shippingAddressSchema, // Embed the shipping address schema
      required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Default to current date if not provided 
  },
  updatedAt: { 
      type: Date, 
      default: Date.now // Default to current date if not provided 
  }

});

module.exports = mongoose.model('Purchase', purchaseSchema);
