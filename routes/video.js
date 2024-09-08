const { Router } = require("express");
const router = Router();

// Middlewares
const  auth  = require("../middlewares/auth");

// Controllers
const controller = require("../controllers/video");

// Routes
router.get("/videos/getCategoryVideos", controller.getCategoryVideo);
router.post("/:userId/channel/:channelId/videos/upload", auth , controller.upload);
router.get("/channel/:channelId/videos/getAll", controller.getAllVideos);
router.get("/:userId/videos/getAllSubsVideos", auth , controller.findAllSubscriptionVideos);
router.put("/:userId/video/:videoId/edit", auth , controller.edit);
router.get("/videos/:videoId/suggestedVideos", controller.getSuggestedVideos);
router.get("/videos/:videoId", controller.getOne);
router.get("/channel/:channelId/videos/latest", controller.getLatestVideo);
router.post("/:userId/channel/:channelId/video/:videoId/addLike", auth , controller.addLike);
router.get("/:userId/channel/:channelId/video/:videoId/findLike", auth , controller.findLike);
router.post("/:userId/channel/:channelId/video/:videoId/addDisLike", auth , controller.addDisLike);
router.get("/:userId/channel/:channelId/video/:videoId/findDisLike", auth , controller.findDisLike);
router.post("/:userId/video/:videoId/view", auth , controller.countView);
router.get("/:userId/channel/:channelId/videos/logInHome", auth , controller.logInHome);
router.delete("/:userId/video/:videoId/delete", auth , controller.delete);
router.get("/search", controller.searchVideos);

module.exports = router;
