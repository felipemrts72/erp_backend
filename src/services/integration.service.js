const Product = require('../modules/products/product.model');
const { StockMove } = require('../modules/inventory/stock.model');
const FinancialMove = require('../modules/finance/finance.model');
const { BOM, ProductionOrder } = require('../modules/production/production.model');

const checkLowStock = async (productId) => {
  const [product, aggregation] = await Promise.all([
    Product.findById(productId),
    StockMove.aggregate([
      { $match: { product_id: productId } },
      {
        $group: {
          _id: '$product_id',
          balance: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'entrada'] },
                '$quantity',
                { $multiply: ['$quantity', -1] }
              ]
            }
          }
        }
      }
    ])
  ]);

  if (!product) return null;
  const balance = aggregation[0]?.balance || 0;
  return {
    productId,
    balance,
    lowStock: balance < product.min_stock
  };
};

const createStockExitForSale = async (sale) => {
  const moves = sale.items.map((item) => ({
    product_id: item.product_id,
    type: 'saida',
    quantity: item.quantity,
    warehouse: item.warehouse || 'principal',
    document_id: sale._id.toString(),
    date: new Date()
  }));

  await StockMove.insertMany(moves);
  const stockStatus = await Promise.all(sale.items.map((item) => checkLowStock(item.product_id)));
  return stockStatus.filter((item) => item?.lowStock);
};

const createReceivableFromSale = async (sale) => {
  return FinancialMove.create({
    partner_id: sale.client_id,
    type: 'receber',
    value: sale.total,
    due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    status: 'pending',
    document_id: sale._id.toString()
  });
};

const createPayableFromPurchase = async (purchase) => {
  return FinancialMove.create({
    partner_id: purchase.supplier_id,
    type: 'pagar',
    value: purchase.total,
    due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    status: 'pending',
    document_id: purchase._id.toString()
  });
};

const createProductionOrdersForSale = async (sale) => {
  const productionOrders = [];

  for (const item of sale.items) {
    const product = await Product.findById(item.product_id);
    if (!product || product.type !== 'fabricado') continue;

    const bomItems = await BOM.find({ product_id: product._id });
    const materials = bomItems.map((bom) => ({
      product_id: bom.component_id,
      quantity: bom.quantity * item.quantity
    }));

    if (materials.length > 0) {
      await StockMove.insertMany(
        materials.map((material) => ({
          product_id: material.product_id,
          type: 'reserva',
          quantity: material.quantity,
          warehouse: item.warehouse || 'principal',
          document_id: sale._id.toString(),
          date: new Date()
        }))
      );
    }

    const order = await ProductionOrder.create({
      product_id: product._id,
      sale_id: sale._id,
      quantity: item.quantity,
      status: 'pending',
      materials
    });

    productionOrders.push(order);
  }

  return productionOrders;
};

module.exports = {
  createStockExitForSale,
  createReceivableFromSale,
  createPayableFromPurchase,
  createProductionOrdersForSale,
  checkLowStock
};
