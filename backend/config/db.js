require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in backend/.env');
  }

  if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
    console.warn('Warning: MONGODB_URI points to localhost. Use Atlas URI in backend/.env');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB Atlas connected — database: ${mongoose.connection.name}`);
};

module.exports = connectDB;
