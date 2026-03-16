const mongoose = require('mongoose');

const quoteItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const quoteSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: Date, default: Date.now },
  valid_until: { type: Date, required: true },
  status: { type: String, enum: ['open', 'approved', 'canceled'], default: 'open' },
  total: { type: Number, required: true, min: 0 },
  items: { type: [quoteItemSchema], default: [] }
});

module.exports = mongoose.model('Quote', quoteSchema);
