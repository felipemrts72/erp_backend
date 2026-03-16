const Sale = require('./sale.model');
const {
  createStockExitForSale,
  createReceivableFromSale,
  createProductionOrdersForSale
} = require('../../services/integration.service');

const create = async (req, res, next) => {
  try {
    const sale = await Sale.create(req.body);
    const [lowStockAlerts, receivable, productionOrders] = await Promise.all([
      createStockExitForSale(sale),
      createReceivableFromSale(sale),
      createProductionOrdersForSale(sale)
    ]);

    res.status(201).json({ sale, receivable, productionOrders, lowStockAlerts });
  } catch (error) {
    next(error);
  }
};

const list = async (_req, res, next) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, list };
