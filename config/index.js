const convict = require("convict");

// Define a schema
var config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  ip: {
    doc: "The IP address to bind.",
    format: String,
    default: "127.0.0.1",
    env: "IP_ADDRESS",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port",
  },
  db: process.env.CLEARDB_DATABASE_URL
    ? {
      url: process.env.CLEARDB_DATABASE_URL,
    }
    : {
      host: {
        doc: "Database host name/IP",
        format: String,
        default: "127.0.0.1",
        env: "DB_HOST"
      },
      name: {
        doc: "Database name",
        format: String,
        default: "database_development",
        env: "DB_NAME"
      },
      username: {
        doc: "Username of database user",
        format: String,
        default: "root",
        env: "DB_USER"
      },
      password: {
        doc: "Password of the database user",
        format: "*",
        default: null,
        env: "DB_PASSWORD"
      },
      custom_port: {
        doc: "Database port",
        format: "port",
        default: 3306,
        env: "DB_PORT",
      },
    },
  jwt_secret: process.env.JWT_SECRET || {
    doc: "Secret for JWT",
    format: String,
    default: "",
    env: "JWT_SECRET",
  },
});

// Load environment dependent configuration
let env = config.get("env");
if (env === "development") {
  config.loadFile(__dirname + "/environments/" + env + ".json");
}

// Perform validation
config.validate({ allowed: "strict" });

module.exports = config;
