const express = require('express');
const controller = require('./production.controller');

const router = express.Router();

router.post('/bom', controller.create);
router.get('/bom', controller.list);
router.get('/bom/:id', controller.getById);
router.put('/bom/:id', controller.update);
router.delete('/bom/:id', controller.remove);

router.post('/', controller.createProduction);
router.get('/', controller.listProduction);
router.put('/:id/start', controller.startProduction);
router.put('/:id/finish', controller.finishProduction);

module.exports = router;
