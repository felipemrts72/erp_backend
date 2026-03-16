const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  value: { type: Number, required: true, min: 0 },
  due_date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
});

const financialMoveSchema = new mongoose.Schema(
  {
    partner_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ['pagar', 'receber'], required: true },
    value: { type: Number, required: true, min: 0 },
    due_date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    document_id: String,
    installments: { type: [installmentSchema], default: [] }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

module.exports = mongoose.model('FinancialMove', financialMoveSchema);
