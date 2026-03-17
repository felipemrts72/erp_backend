const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

db.query('SELECT 1')
  .then(() => {
    console.log('Banco conectado');

    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((error) => {
    console.error('Falha ao conectar no banco', error);
    process.exit(1);
  });
