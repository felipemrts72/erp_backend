const Product = require('./product.model');
const createCrudController = require('../../services/crudFactory');
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 }
  },
  { versionKey: false }
);

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const base = createCrudController(Product);

const generateSku = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'product_sku' },
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return `PROD-${String(counter.value).padStart(4, '0')}`;
};

const create = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (!payload.sku) {
      payload.sku = await generateSku();
    }
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  ...base,
  create
};
