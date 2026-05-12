const { Sequelize } = require('sequelize');
const config = require('./config');

const [host, instanceName] = config.db.host.split('\\');

// Automatically use Integrated Security if no username is provided
const isIntegrated = !config.db.user;

const sequelizeOptions = {
  host: host,
  dialect: 'mssql',
  logging: config.env === 'production' ? false : (msg) => {
    // Only log errors, not every SQL query (too noisy in combined server)
    if (msg.toLowerCase().includes('error')) console.error('[SQL]', msg);
  },
  dialectOptions: {
    options: {
      encrypt: config.db.encrypt,
      trustServerCertificate: true,
      integratedSecurity: isIntegrated,
      domain: isIntegrated ? (process.env.DB_DOMAIN || '.') : undefined,
      connectTimeout: 30000
    }
  }
};

if (instanceName) {
  sequelizeOptions.dialectOptions.options.instanceName = instanceName;
} else {
  sequelizeOptions.port = config.db.port || 1433;
}

console.log(`\n--- DB Connection Info ---`);
let authPart = isIntegrated ? `Integrated Security=true` : `User ID=${config.db.user};Password=********`;
const connStr = `Server=${host}${instanceName ? '\\\\' + instanceName : ''}${sequelizeOptions.port ? ',' + sequelizeOptions.port : ''};Database=${config.db.name};${authPart};Encrypt=${config.db.encrypt};TrustServerCertificate=true;`;
console.log(`Connection String: ${connStr}`);
console.log(`Auth Mode: ${isIntegrated ? 'Windows Authentication' : 'SQL Server Authentication'}`);
console.log(`--------------------------\n`);

const sequelize = new Sequelize({
  ...sequelizeOptions,
  database: config.db.name,
  username: config.db.user || null,
  password: config.db.password || null,
});

module.exports = sequelize;
