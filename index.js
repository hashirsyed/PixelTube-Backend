const config = require("./config/index.js");
const app = require("./app.js");
const port = config.get("port");

app.listen(port, () => {
  console.log(`✅ Server running on port: ${port}`);
});
