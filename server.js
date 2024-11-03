const config = require("./config/index.js");
const app = require("./app.js");

const port = config.get("port") || 3000;

app.listen(port, () => {
  console.log(`✅ Server running on port: ${port}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
});

// Example logging to ensure config is loaded correctly
console.log('Loaded configuration:', JSON.stringify(config, null, 2));
