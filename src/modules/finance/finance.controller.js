const FinancialMove = require('./finance.model');

const createReceivable = async (req, res, next) => {
  try {
    const move = await FinancialMove.create({ ...req.body, type: 'receber' });
    res.status(201).json(move);
  } catch (error) {
    next(error);
  }
};

const createPayable = async (req, res, next) => {
  try {
    const move = await FinancialMove.create({ ...req.body, type: 'pagar' });
    res.status(201).json(move);
  } catch (error) {
    next(error);
  }
};

const list = async (_req, res, next) => {
  try {
    const now = new Date();
    const data = await FinancialMove.find().sort({ due_date: 1 });
    const overdue = data.filter((item) => item.status === 'pending' && item.due_date < now);
    res.json({ data, overdueAlerts: overdue });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const move = await FinancialMove.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!move) return res.status(404).json({ message: 'Lançamento não encontrado' });
    res.json(move);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReceivable, createPayable, list, update };
