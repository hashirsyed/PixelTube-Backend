const config = require("./config");
const app = require("./app.js");
const port = config.get("port");

app.listen(port, () => {
  console.log(`✅ Server running on port: ${port}`);
});
app.get("/",(req,res)=>{
res.status(200).send("Hello from the server")
})