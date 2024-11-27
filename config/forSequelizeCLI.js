const config = require("./index.js");

module.exports = {
  dialect: "mysql",
  database: config.get("db.name"),
  username: config.get("db.username"),
  password: config.get("db.password"),
  host: config.get("db.host"),
  port: config.get("db.custom_port"),
  dialectOptions: {
    charset: "utf8mb4", // Set the charset to utf8mb4 for full Unicode suppor
    connectTimeout: 60000,
  },
  define: {
    charset: "utf8mb4", // Ensure tables and columns use utf8mb4
    collate: "utf8mb4_unicode_ci", // Set the collation to utf8mb4_unicode_ci for proper Unicode sorting
  },
};
