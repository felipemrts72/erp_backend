const Product = require('./product.model');
const createCrudController = require('../../services/crudFactory');

module.exports = createCrudController(Product);
