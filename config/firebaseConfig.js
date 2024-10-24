// /config/firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require('..//products-e4f8c-4c7d59ee2e52.json'); // Download your Firebase service key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://products-e4f8c.firebaseio.com",
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
});

module.exports = admin;
