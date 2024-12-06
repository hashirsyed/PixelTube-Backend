const { Router } = require("express");
const router = Router();

// Middlewares
const  auth  = require("../middlewares/auth");

// Controllers
const controller = require("../controllers/video");

// Routes
router.post("/:userId/channel/:channelId/videos/upload", auth , controller.upload);
router.post("/videos/:videoId/upload/real/S", controller.uploadS);
router.post("/:userId/video/:videoId/view", auth , controller.countView);
router.post("/:userId/channel/:channelId/video/:videoId/addDisLike", auth , controller.addDisLike);
router.post("/:userId/channel/:channelId/video/:videoId/addLike", auth , controller.addLike);
router.put("/:userId/video/:videoId/edit", auth , controller.edit);
router.delete("/videos/:videoId/reject", controller.pDelete);
router.delete("/:userId/video/:videoId/delete", auth , controller.delete);
router.get("/channel/:channelId/videos/getAll", controller.getAllVideos);
router.get("/videos/getCategoryVideos", controller.getCategoryVideo);
router.get("/videos/getFull", controller.getFullVideos);
router.get("/videos/getAllPVideos", controller.getAllPVideos);
router.get("/videos/getPending", controller.getPVideos);
router.get("/:userId/videos/getAllSubsVideos", auth , controller.findAllSubscriptionVideos);
router.get("/videos/:videoId/suggestedVideos", controller.getSuggestedVideos);
router.get("/videos/:videoId", controller.getOne);
router.get("/videos/admin/:videoId", controller.getOnePVideo);
router.get("/videos", controller.getOneByTitle);
router.get("/channel/:channelId/videos/latest", controller.getLatestVideo);
router.get("/:userId/channel/:channelId/video/:videoId/findLike", auth , controller.findLike);
router.get("/:userId/channel/:channelId/video/:videoId/findDisLike", auth , controller.findDisLike);
router.get("/:userId/channel/:channelId/videos/logInHome", auth , controller.logInHome);
router.get("/search", controller.searchVideos);

module.exports = router;
