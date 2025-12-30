const mongoose = require('mongoose');

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://kannanmayilsamy:kannanms@kannan.qij5fmf.mongodb.net/AgroBidding?appName=Kannan';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;
