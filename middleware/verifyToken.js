// middleware/verifyToken.js
const admin = require('firebase-admin');



const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
  console.log(token);
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    // Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken)
    req.user = decodedToken; // Attach the decoded token to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
  }
};

module.exports = verifyToken;
