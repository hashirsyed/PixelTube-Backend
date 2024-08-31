const { Router } = require("express");
const router = Router();

// Routers
const userRouter = require("./user");
const videoRouter = require("./video");
const channelRouter = require("./channel");
const commentRouter = require("./comment");
const playlistRouter = require("./playlist");

router.use("/users", userRouter);
router.use("/users", videoRouter);
router.use("/users", channelRouter);
router.use("/users", commentRouter);
router.use("/users", playlistRouter);

module.exports = router;
