const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hrm_db';
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Primary connection failed (${error.message}). Attempting local fallback...`);
    try {
      const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/hrm_db', {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`[Database] Local MongoDB Connected: ${localConn.connection.host}`);
    } catch (localError) {
      console.error(`[Database Error] Could not connect to local MongoDB: ${localError.message}`);
      console.error(`[Database Help] Ensure MONGODB_URI in backend/.env is correct or local MongoDB service (mongod) is running.`);
    }
  }
};

module.exports = connectDB;
