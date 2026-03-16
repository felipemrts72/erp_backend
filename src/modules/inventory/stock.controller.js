const mongoose = require('mongoose');
const { Supplier, StockMove, PurchaseOrder } = require('./stock.model');
const { createPayableFromPurchase, checkLowStock } = require('../../services/integration.service');

const stockEntry = async (req, res, next) => {
  try {
    const move = await StockMove.create({ ...req.body, type: 'entrada' });
    res.status(201).json(move);
  } catch (error) {
    next(error);
  }
};

const stockExit = async (req, res, next) => {
  try {
    const move = await StockMove.create({ ...req.body, type: 'saida' });
    const lowStock = await checkLowStock(move.product_id);
    res.status(201).json({ move, lowStockAlert: lowStock?.lowStock ? lowStock : null });
  } catch (error) {
    next(error);
  }
};

const listStock = async (_req, res, next) => {
  try {
    const balances = await StockMove.aggregate([
      {
        $group: {
          _id: '$product_id',
          balance: {
            $sum: {
              $cond: [{ $eq: ['$type', 'entrada'] }, '$quantity', { $multiply: ['$quantity', -1] }]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    const alerts = balances.filter((item) => item.balance < (item.product.min_stock || 0));
    res.json({ balances, alerts });
  } catch (error) {
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

const listSuppliers = async (_req, res, next) => {
  try {
    res.json(await Supplier.find());
  } catch (error) {
    next(error);
  }
};

const createPurchaseOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const [purchase] = await PurchaseOrder.create([req.body], { session });

    for (const item of purchase.items) {
      await StockMove.create(
        [
          {
            product_id: item.product_id,
            type: 'entrada',
            quantity: item.quantity,
            document_id: purchase._id.toString(),
            date: new Date()
          }
        ],
        { session }
      );
    }

    const payable = await createPayableFromPurchase(purchase);
    await session.commitTransaction();
    res.status(201).json({ purchase, payable });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const listPurchases = async (_req, res, next) => {
  try {
    res.json(await PurchaseOrder.find().sort({ date: -1 }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  stockEntry,
  stockExit,
  listStock,
  createSupplier,
  listSuppliers,
  createPurchaseOrder,
  listPurchases
};
