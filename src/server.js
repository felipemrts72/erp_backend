const app = require('./app');
const connectDatabase = require('./config/database');

const PORT = process.env.PORT || 3000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((error) => {
    console.error('Falha ao conectar no banco', error);
    process.exit(1);
  });
