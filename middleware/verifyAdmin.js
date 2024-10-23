// middleware/verifyToken.js
const admin = require('firebase-admin');



const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
  console.log(token)
  console.log(req.body)
  if (req.body.data){
    const { userRole } = req.body.data;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  
    try {
      // Verify the token with Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log(decodedToken)
      req.user = decodedToken; // Attach the decoded token to the request object
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Access forbidden: Admins only' });
      }
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    }

  }else if(req.body){
    const { userRole } = req.body;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  
    try {
      // Verify the token with Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log(decodedToken)
      req.user = decodedToken; // Attach the decoded token to the request object
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Access forbidden: Admins only' });
      }
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    }

  }

  
};

module.exports = verifyAdmin;

  