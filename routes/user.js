const { Router } = require("express");
const router = Router();
const controller = require("../controllers/user");

// Routes
router.post("/", controller.signUp);
router.get("/", (req,res)=>{
    res.status(200).send("Message from the backend")
});
router.post("/login", controller.login);

module.exports = router;
