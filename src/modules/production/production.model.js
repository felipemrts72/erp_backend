const mongoose = require('mongoose');

const bomSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  component_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 0.001 }
});

const productionMaterialSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 0.001 }
});

const productionOrderSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sale_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
  quantity: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['pending', 'in_production', 'finished'], default: 'pending' },
  start_date: Date,
  end_date: Date,
  materials: { type: [productionMaterialSchema], default: [] }
});

const BOM = mongoose.model('BOM', bomSchema);
const ProductionOrder = mongoose.model('ProductionOrder', productionOrderSchema);

module.exports = { BOM, ProductionOrder };
