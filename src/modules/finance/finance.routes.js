const express = require('express');
const controller = require('./finance.controller');

const router = express.Router();

router.post('/receivable', controller.createReceivable);
router.post('/payable', controller.createPayable);
router.get('/', controller.list);
router.put('/:id', controller.update);

module.exports = router;
