const mongoose = require('mongoose');

const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/erp_industrial';
  await mongoose.connect(mongoUri);
  console.log('MongoDB conectado');
};

module.exports = connectDatabase;
