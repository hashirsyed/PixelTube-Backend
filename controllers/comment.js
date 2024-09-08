// const { secret } = require("../constants");
const { Op } = require("sequelize");
const { Comments, sequelize } = require("../models");
const { Channels } = require("../models");
const { Users } = require("../models");
const { Videos } = require("../models");
const { generateErrorInstance } = require("../utils");

module.exports = {
  create: async function (req, res) {
    try {
      await sequelize.transaction(async (transaction) => {
      let { content } = req.body;
      const { videoId, channelId } = req.params;
      if (!content && !videoId && !channelId) {
        throw generateErrorInstance({
          status: 404,
          message: "Required fields cannot be empty",
        });
      }

      let comment = await Comments.create({
        fkChannelId: channelId,
        fkVideoId: videoId,
        content,
      });
      comment = await comment.toJSON();
      await Videos.update(
        { comments: sequelize.literal("comments + 1") },
        { where: { id: videoId }, transaction, individualHooks: true }
      )

      res.status(201).send({ message: "Commented Successfully", comment });
      })
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getAllComments: async function (req, res) {
    try {
      let { videoId } = req.params;// Assuming you send the creator's channelId in the request
  
      // Get all comments for the video
      let comments = await Comments.findAll({
        where: {
          fkVideoId: videoId,
        },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Channels,
            as: "channel",
            attributes: ["id", "name", "handleBy"],
            include: {
              model: Users,
              as: "user",
              attributes: ["profileUrl"],
            },
          },
          {
            model : Videos,
            as : "video",
            attributes : ["fkChannelId"]
          }
        ],
      });
  
      // Separate the creator's comment from the rest
      let creatorComment = comments.filter(comment => comment.channel.id === comment.video.fkChannelId);
      let otherComments = comments.filter(comment => comment.channel.id !== comment.video.fkChannelId);
  
      // Combine the creator's comment at the top
      let sortedComments = [...creatorComment, ...otherComments];
  
      res.status(201).send(sortedComments);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getLatestComments: async function (req, res) {
    try {
      const { channelId } = req.params;
      let videos = await Videos.findAll({
        where: {
          fkChannelId: channelId,
        },
      });
      videos = videos.map((video) => video.id);

      let comments = await Comments.findAll({
        where: {
          fkVideoId: videos,
          fkChannelId : {
            [Op.ne] : channelId
          }
        },

        order: [["createdAt", "DESC"]],
        limit: 4,
        include: [
          {
            model: Channels,
            as: "channel",
            attributes: ["id", "name", "handleBy"],
            include: {
              model: Users,
              as: "user",
              attributes: ["profileUrl"],
            },
          },
          {
            model: Videos,
            as: "video",
            attributes: ["thumbnail"],
          },
        ],
      });
      

      res.status(200).send(comments);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getAll: async function (req, res) {
    try {
      const { channelId } = req.params;
      let videos = await Videos.findAll({
        where: {
          fkChannelId: channelId,
        },
      });
      videos = videos.map((video) => video.id);

      let comments = await Comments.findAll({
        where: {
          fkVideoId: videos,
          fkChannelId : {
            [Op.ne] : channelId
          }
        },

        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Channels,
            as: "channel",
            attributes: ["id", "name", "handleBy"],
            include: {
              model: Users,
              as: "user",
              attributes: ["profileUrl"],
            },
          },
          {
            model: Videos,
            as: "video",
            attributes: ["thumbnail","title"],
          },
        ],
      });
      

      res.status(200).send(comments);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  
};
