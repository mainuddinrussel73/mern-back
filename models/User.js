const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true },  // Firebase UID
  name: { type: String, required: true },
  profilePicture: { type: String }, // URL to profile picture
  coverPicture: { type: String }, // URL to profile picture
  email: { type: String, required: true, unique: true },
  countryCode: String,
  phone: String,
  address: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },  // 'user' or 'admin'
  createdAt: { 
    type: Date, 
    default: Date.now // Automatically set the date when a category is created
  },
  updatedAt: { 
    type: Date, 
    default: Date.now // Automatically set the date when a category is created
  }
});

module.exports = mongoose.model('Users', userSchema);
