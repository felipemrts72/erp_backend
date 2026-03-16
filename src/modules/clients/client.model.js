const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: String,
    number: String,
    district: String,
    city: String,
    state: String,
    zip: String
  },
  { _id: false }
);

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['pf', 'pj'], required: true },
    document: { type: String, required: true, unique: true, trim: true },
    rg: { type: String, trim: true },
    ie: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    active: { type: Boolean, default: true },
    address: { type: addressSchema, default: {} }
  },
  { timestamps: true }
);

clientSchema.index({ document: 1 });

module.exports = mongoose.model('Client', clientSchema);
