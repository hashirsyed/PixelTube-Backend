const config = require("./index.js");

if (process.env.CLEARDB_DATABASE_URL) {
  // Heroku environment
  module.exports = {
    use_env_variable: "CLEARDB_DATABASE_URL",
    dialect: "mysql",
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  };
} else {
  module.exports = {
  dialect: "mysql",
  database: config.get("db.name"),
  username: config.get("db.username"),
  password: config.get("db.password"),
  host: config.get("db.host"),
  dialectOptions: {
    charset: 'utf8mb4',  // Set the charset to utf8mb4 for full Unicode support
  },
  define: {
    charset: 'utf8mb4',   // Ensure tables and columns use utf8mb4
    collate: 'utf8mb4_unicode_ci',  // Set the collation to utf8mb4_unicode_ci for proper Unicode sorting
    },
  };
}
