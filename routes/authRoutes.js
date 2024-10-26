const express = require('express');
const router = express.Router();
const admin = require('../config/firebaseConfig');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const JWT_SECRET = process.env.JWT_SECRET;
console.log('okk out');

// Register or Login the user
router.get('/login/:uid', verifyToken, async (req, res) => {
  const uid = req.params.uid;
  console.log('okk' + uid);
  try {
    // Verify the Firebase token
    const _user = await User.findOne({ firebaseUid : uid });

    if (!_user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(_user)

    res.status(200).json({ success: true,message: 'User authenticated successfully', _user });
  } catch (error) {
    res.status(400).json({ success: false,message: 'Authentication failed', error });
  }
});

router.get('/user/:uid',verifyToken ,async (req, res) => {
  const uid = req.params.uid;
  console.log('okk' + uid);
  try {
    // Verify the Firebase token
    const _user = await User.findOne({ firebaseUid : uid });

    if (!_user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(_user)

    res.status(200).json({ success: true,message: 'User found', _user });
  } catch (error) {
    res.status(400).json({ success: false,message: 'Not found', error });
  }
});


// Add a new user
router.post('/users',verifyAdmin, async (req, res) => {
  try {
    console.log(req.body);
    

    const { name,password, email,countryCode, phone, address, role } = req.body.data.userForm;

    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      phoneNumber: countryCode+phone,
    });
    console.log(firebaseUser);
    

    const newUser = new User({
      firebaseUid: firebaseUser.uid, // Firebase UID
      name,
      email,
      countryCode,
      phone,
      address,
      role: role || 'user', // Default role to 'user' if not provided
    });    
    await newUser.save();
    res.status(201).json({ success: true, message: 'User added successfully', user: newUser });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error });
  }
});

// Update a user
router.put('/users/:firebaseUid', async (req, res) => {

  console.log("-----------------------")
  console.log(req.params)
  console.log( req.body.data.userForm);
  console.log("-----------------------")

  try {
    const {firebaseUid} = req.params;
    const { name,countryCode,profilePicture, phone, address, role } = req.body.data.userForm;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: firebaseUid },  // Query by firebaseUid
      { name, phone, profilePicture ,countryCode, address, role },  // Fields to update
      { new: true }  // Return the updated document
    );
    console.log(updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error });
  }
});

// Delete a user
router.delete('/users/:firebaseUid',verifyAdmin, async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    await admin.auth().deleteUser(firebaseUid);


    await User.findOneAndDelete({ firebaseUid: firebaseUid });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const _users = await User.find({});
    console.log(_users);
    res.status(200).json({ success: true, users : _users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  console.log('---------------------------');
  console.log(req.body);
  console.log('---------------------------');

  const { firebaseUid, name, email,countryCode, phone, address } = req.body;


  const existingUser = await User.findOne({ firebaseUid });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  
  try {
    const newUser = new User({
      firebaseUid,  // Firebase User ID
      name,
      email,
      countryCode,
      phone,
      address,
    });

    console.log(newUser)

    const savedUser = await newUser.save();
    res.status(200).json({success: true, message: 'User created successfully', savedUser });
  } catch (error) {
    console.error('Error saving product:', error);

    res.status(500).json({ success: false, error: 'Error registering user' });
  }
});

module.exports = router;
