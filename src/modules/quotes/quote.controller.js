const Quote = require('./quote.model');
const Sale = require('../sales/sale.model');
const {
  createStockExitForSale,
  createReceivableFromSale,
  createProductionOrdersForSale
} = require('../../services/integration.service');

const create = async (req, res, next) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json(quote);
  } catch (error) {
    next(error);
  }
};

const list = async (_req, res, next) => {
  try {
    const quotes = await Quote.find().sort({ date: -1 });
    res.json(quotes);
  } catch (error) {
    next(error);
  }
};

const approve = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Orçamento não encontrado' });
    if (quote.status !== 'open') return res.status(400).json({ message: 'Somente orçamento aberto pode ser aprovado' });

    quote.status = 'approved';
    await quote.save();

    const sale = await Sale.create({
      client_id: quote.client_id,
      quote_id: quote._id,
      date: new Date(),
      status: 'pending',
      total: quote.total,
      items: quote.items
    });

    const [lowStockAlerts, receivable, productionOrders] = await Promise.all([
      createStockExitForSale(sale),
      createReceivableFromSale(sale),
      createProductionOrdersForSale(sale)
    ]);

    res.json({ quote, sale, receivable, productionOrders, lowStockAlerts });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, list, approve };
