const express = require('express');
const controller = require('./quote.controller');

const router = express.Router();

router.post('/', controller.create);
router.get('/', controller.list);
router.post('/:id/approve', controller.approve);

module.exports = router;
