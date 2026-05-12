const app = require('./app');
const config = require('./config/config');
const { syncDatabase } = require('./models');

const startServer = async () => {
  await syncDatabase();
  
  app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
    console.log(`Swagger docs available at http://localhost:${config.port}/api-docs`);
  });
};

startServer();
