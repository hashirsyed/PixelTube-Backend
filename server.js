const config = require("./config/index.js");
const app = require("./app.js");

const port = config.get("port") || 3000;

app.listen(port, () => {
  console.log(`✅ Server running on port: ${port}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
});
console.log({
  database: config.get("db.name"),
  username: config.get("db.username"),
  host: config.get("db.host"),
  port: config.get("db.custom_port"),
  dialect: "mysql",
});

// Example logging to ensure config is loaded correctly
console.log('Loaded configuration:', JSON.stringify(config, null, 2));
console.log('Loaded Environment Config:', config.get('db'));

