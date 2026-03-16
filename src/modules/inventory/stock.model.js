const mongoose = require('mongoose');

const stockMoveSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['entrada', 'saida', 'reserva'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  document_id: { type: String },
  date: { type: Date, default: Date.now }
});

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  document: { type: String, required: true },
  phone: String,
  email: String
});

const purchaseItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const purchaseOrderSchema = new mongoose.Schema({
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'open' },
  total: { type: Number, required: true, min: 0 },
  items: { type: [purchaseItemSchema], default: [] }
});

const Supplier = mongoose.model('Supplier', supplierSchema);
const StockMove = mongoose.model('StockMove', stockMoveSchema);
const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

module.exports = { Supplier, StockMove, PurchaseOrder };
