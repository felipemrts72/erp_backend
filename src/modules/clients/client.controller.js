const Client = require('./client.model');
const createCrudController = require('../../services/crudFactory');

module.exports = createCrudController(Client);
