const express = require('express');
const Purchase = require('../models/Purchase'); // Ensure this is your Purchase model
const router = express.Router();

router.get('/top-selling-products', async (req, res) => {
    try {
        // Extract query parameters for timeframe, filters, and pagination
        const { startDate, endDate, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        // Convert startDate and endDate to Date objects, defaulting to the last 30 days if not provided
        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();

        // Pagination: Calculate the number of documents to skip based on the current page
        const skip = (page - 1) * limit;

        // Build the filter object for product filtering
       

        // MongoDB aggregation pipeline with enhanced functionality
        const topSellingProducts = await Purchase.aggregate([
            // Step 1: Filter by purchaseDate (timeframe)
            {
                $match: {
                    purchaseDate: { $gte: start, $lte: end }  // Timeframe filter
                }
            },
            // Step 2: Group by productId and sum the quantities
            {
                $group: {
                    _id: '$productId',
                    totalQuantity: { $sum: '$quantity' }  // Sum quantities sold per product
                }
            },
            // Step 3: Sort by totalQuantity in descending order
            {
                $sort: { totalQuantity: -1 }
            },
            // Step 4: Limit the number of results for pagination
            {
                $skip: skip
            },
            {
                $limit: parseInt(limit)
            },
            // Step 5: Lookup product details from the Product collection
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',  // productId from Purchase
                    foreignField: '_id',  // _id from Product
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'  // Flatten productDetails array
            },
            {
                $lookup: {
                    from: 'categories', // Ensure this is the correct collection name
                    localField: 'productDetails.category', // categoryId in Product
                    foreignField: '_id', // _id in Category
                    as: 'categoryDetails' // This will hold the category details
                }
            },
            {
                $unwind: '$categoryDetails' // Flatten categoryDetails array
            },
             // Step 6: Filter by category (if provided)
            {
                $match: category ? { 'categoryDetails.name': category } : {}  // Filter by category
            },
            // Step 7: Project only the relevant fields
            {
                $project: {
                    _id: 0,
                    productId: '$_id',
                    totalQuantity: 1,
                    'productDetails.name': 1,
                    'productDetails.description': 1,
                    'productDetails.price': 1,
                    'productDetails.imageUrl': 1,
                    'categoryDetails.name': 1 ,
                    'categoryDetails._id': 1 
                }
            }
        ]);

        res.status(201).json({ ok: true, data: topSellingProducts });
    } catch (error) {
        console.error('Error fetching top-selling products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;