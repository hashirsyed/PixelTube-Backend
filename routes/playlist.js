const { Router } = require("express");
const router = Router();

// Middlewares
const  auth  = require("../middlewares/auth");

// Controllers
const controller = require("../controllers/playlist.js");

// Routes
router.post("/:userId/playlist/create", auth , controller.create);
router.get("/:userId/playlist/getAll", auth , controller.getAll);
router.put("/:userId/playlist/:playlistId/edit", auth , controller.edit);
router.post("/:userId/playlist/:playlistId/videos/:videoId/addVideo", auth , controller.addVideo);
router.get("/:userId/playlist/videos/:videoId/findVideo", auth , controller.findVideoInPlaylist);
router.get("/:userId/playlist/:playlistId/allVideos", auth , controller.findAllVideos);
router.get("/:userId/playlist/:playlistId", auth , controller.getPlaylistDetails);
router.delete("/:userId/playlist/:playlistId/delete", auth , controller.deletePlaylist);
router.delete("/:userId/playlist/:playlistId/video/:videoId/delete", auth , controller.removeVideoFromPlaylist);

module.exports = router;
