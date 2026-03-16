const { BOM, ProductionOrder } = require('./production.model');
const createCrudController = require('../../services/crudFactory');

const bomCrud = createCrudController(BOM);

const createProduction = async (req, res, next) => {
  try {
    const order = await ProductionOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const listProduction = async (_req, res, next) => {
  try {
    res.json(await ProductionOrder.find().sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
};

const startProduction = async (req, res, next) => {
  try {
    const order = await ProductionOrder.findByIdAndUpdate(
      req.params.id,
      { status: 'in_production', start_date: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Ordem de produção não encontrada' });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const finishProduction = async (req, res, next) => {
  try {
    const order = await ProductionOrder.findByIdAndUpdate(
      req.params.id,
      { status: 'finished', end_date: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Ordem de produção não encontrada' });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  ...bomCrud,
  createProduction,
  listProduction,
  startProduction,
  finishProduction
};
