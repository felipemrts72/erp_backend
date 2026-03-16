const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, unique: true, trim: true },
    barcode: { type: String, trim: true },
    category: { type: String, trim: true },
    description: String,
    type: { type: String, enum: ['fabricado', 'revenda'], required: true },
    unit: { type: String, default: 'un', trim: true },
    weight: { type: Number, min: 0 },
    location: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    image: String,
    min_stock: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ name: 1 });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Product', productSchema);
