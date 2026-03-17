const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res
    .status(status)
    .json({ message: err.message || 'Erro interno do servidor' });
});

module.exports = app;
