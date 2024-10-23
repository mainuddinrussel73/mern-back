const mongoose = require('mongoose');
const Purchase = require('./models/Purchase');
const Product = require('./models/Product'); // Ensure you have the Product model imported

const mongoURI = "mongodb+srv://main:pass@cluster0.lg86q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('MongoDB connected');

    // Define the userId to be used for all purchases
    const userId = '67121a4f3b24b7d22d3966c0';

    // List of product IDs to use
    const productIds = [
        "64dfc2b9f3a22b1c9bfa4f20", // The Great Gatsby
        "64dfc2b9f3a22b1c9bfa4f21", // Introduction to JavaScript
        "64dfc2b9f3a22b1c9bfa4f22", // MacBook Pro
        "64dfc2b9f3a22b1c9bfa4f23", // The Catcher in the Rye
        "64dfc2b9f3a22b1c9bfa4f24", // Understanding Node.js
        "64dfc2b9f3a22b1c9bfa4f25", // Dell XPS 13
        "64dfc2b9f3a22b1c9bfa4f26", // Introduction to Python Programming
        "64dfc2b9f3a22b1c9bfa4f27", // Samsung Galaxy S21
        "64dfc2b9f3a22b1c9bfa4f28", // The Lean Startup
        "64dfc2b9f3a22b1c9bfa4f29", // Learning React
        "64dfc2b9f3a22b1c9bfa4f30", // Honda Accord
        "64dfc2b9f3a22b1c9bfa4f31", // Mountain Bike
        "64dfc2b9f3a22b1c9bfa4f32", // Recycled Plastic Bins
        "64dfc2b9f3a22b1c9bfa4f33"  // Graphic Design Fundamentals
    ];

    const purchases = [];
    for (let i = 0; i < 100; i++) { // Generate 100 random purchase entries
        const randomProductId = productIds[Math.floor(Math.random() * productIds.length)];
        const quantity = Math.floor(Math.random() * 5) + 1; // Random quantity between 1 and 5
        const totalPrice = (quantity * 29.99).toFixed(2); // Example price, replace with the actual product price lookup if needed

        const purchase = {
            userId: new mongoose.Types.ObjectId(userId), // Using the specified user ID
            productId: new mongoose.Types.ObjectId(randomProductId), // Selecting a random product ID from the provided list
            quantity,
            totalPrice,
            purchaseDate: new Date(), // Current date
            status: 'Completed', // Set purchase status
            paymentMethod: 'Credit Card', // Set payment method
            shippingAddress: { // Generate random shipping address
                name: `User ${i + 1}`,
                addressLine1: `${Math.floor(Math.random() * 1000)} Main St`,
                addressLine2: '',
                city: 'Anytown',
                state: 'NY',
                zipCode: '12345',
                country: 'USA'
            },
            createdAt: new Date(), // Record creation date
            updatedAt: new Date()  // Record last updated date
        };

        purchases.push(purchase);
    }

    await Purchase.insertMany(purchases);
    console.log('Random purchases generated:', purchases);
    mongoose.disconnect();
})
.catch(err => {
    console.error(err);
    mongoose.disconnect();
});