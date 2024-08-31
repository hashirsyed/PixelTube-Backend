const { Router } = require("express");
const router = Router();

// Middlewares
const  auth  = require("../middlewares/auth");

// Controllers
const controller = require("../controllers/comment");

// Routes
router.post("/:userId/channel/:channelId/videos/:videoId/comments/create", auth , controller.create);
router.get("/:userId/channel/:channelId/videos/:videoId/comments/getAll", auth , controller.getAllComments);
router.get("/channel/:channelId/comments/latest", controller.getLatestComments);

module.exports = router;
