const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const purchasehighlightRoutes = require('./routes/purchasehighlightRoutes');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({

  extended: true
  
}));
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000,  // 45 seconds
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/purchasehighlight', purchasehighlightRoutes);
app.get('/', async (req, res) => {
    
    try {

      res.send("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
