const { Router } = require("express");
const router = Router();

// Middlewares
const  auth  = require("../middlewares/auth");

// Controllers
const controller = require("../controllers/channel");

// Routes
router.post("/:userId/channel/create", auth , controller.create);
router.post("/channel/create/real/S", controller.createS);
router.post("/:userId/channel/:channelId/addSubscriber", auth , controller.addSubscriber);
router.put("/:userId/channel/edit", auth , controller.edit);
router.delete("/channels/:userId/reject", controller.delS);
router.get("/channels/getFull", controller.getFullChannels);
router.get("/channels/getAllPChannels", controller.getAllPChannels);
router.get("/channels/getPending", controller.getPChannels);
router.get("/:userId/channel/myChannelDetails", auth , controller.getMyChannelDetails);
router.get("/:channelId/channel/channelDetails" , controller.getChannelDetails);
router.get("/:channelId/channel/getOnePChannel" , controller.getPChannelDetails);
router.get("/:userId/channel/:channelId/checkSubscriber", auth , controller.findSubscriber);
router.get("/channel/:channelId/subscribers/latest", controller.getLatestSubscribers);
router.get("/channel/:channelId/subscribers/all", controller.getAllSubscribers);
router.get("/:userId/channel/subscription/getAll", auth ,  controller.findAllSubscriptions);

module.exports = router;
