const express = require('express');

const clientRoutes = require('./modules/clients/client.routes');
const productRoutes = require('./modules/products/product.routes');
const quoteRoutes = require('./modules/quotes/quote.routes');
const saleRoutes = require('./modules/sales/sale.routes');
const stockRoutes = require('./modules/inventory/stock.routes');
const financeRoutes = require('./modules/finance/finance.routes');
const productionRoutes = require('./modules/production/production.routes');
const authRoutes = require('./modules/auth/auth.routes');

const router = express.Router();

router.use('/clients', clientRoutes);
router.use('/products', productRoutes);
router.use('/quotes', quoteRoutes);
router.use('/sales', saleRoutes);
router.use('/stock', stockRoutes);
router.use('/finance', financeRoutes);
router.use('/production', productionRoutes);
router.use('/auth', authRoutes);

module.exports = router;
