const { Sequelize } = require ("sequelize");
const { BDD }  = require ('../config');

// Prefer a full DATABASE_URL when provided (Render sets this for managed DBs).
// Fall back to the individual DB_* values from config.js for local runs.
const databaseUrl = process.env.DATABASE_URL || `postgres://${BDD.user}:${BDD.password}@${BDD.host}:${BDD.port || 5432}/${BDD.bdname}`;

// Decide whether to enable SSL. Accept DB_SSL=1/true or production environment as signals.
const envSsl = (typeof process.env.DB_SSL === 'string' && ['1', 'true', 'yes'].includes(process.env.DB_SSL.toLowerCase())) || process.env.NODE_ENV === 'production';

const sequelizeOptions = {
  dialect: 'postgres',
  protocol: 'postgres',
  // If SSL is required (e.g. Render Postgres), pass an ssl object that doesn't
  // reject unauthorized certificates. This avoids common TLS verification errors
  // when the hosting provider uses certificates that don't match the strict
  // verification chain used by node's TLS.
  dialectOptions: envSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  define: {
    timestamps: false
  }
};

const sequelize = new Sequelize(databaseUrl, sequelizeOptions);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Pollutions = require("./pollution.model.js")(sequelize, Sequelize);
db.Utilisateurs = require("./utilisateur.model.js")(sequelize, Sequelize);

module.exports = db;