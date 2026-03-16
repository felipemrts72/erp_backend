const express = require('express');
const controller = require('./stock.controller');

const router = express.Router();

router.post('/entry', controller.stockEntry);
router.post('/exit', controller.stockExit);
router.get('/', controller.listStock);

router.post('/suppliers', controller.createSupplier);
router.get('/suppliers', controller.listSuppliers);
router.post('/purchases', controller.createPurchaseOrder);
router.get('/purchases', controller.listPurchases);

module.exports = router;
