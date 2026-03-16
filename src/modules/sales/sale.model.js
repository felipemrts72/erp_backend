const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const saleSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  quote_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  total: { type: Number, required: true, min: 0 },
  items: { type: [saleItemSchema], default: [] }
});

module.exports = mongoose.model('Sale', saleSchema);
