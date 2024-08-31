// const { secret } = require("../constants");
const { Op } = require("sequelize");
const { Videos, sequelize } = require("../models");
const { Channels } = require("../models");
const { Users } = require("../models");
const { Likes } = require("../models");
const { DisLikes } = require("../models");
const { ChannelSubscribers } = require("../models");
const { Views } = require("../models");
const { generateErrorInstance } = require("../utils");

module.exports = {
  upload: async function (req, res) {
    try {
      let { videoUrl, title, description, thumbnail, tags, category } =
        req.body;
      const { channelId } = req.params;
      if (
        !videoUrl &&
        !title &&
        !description &&
        !thumbnail &&
        !tags &&
        !category
      ) {
        throw generateErrorInstance({
          status: 404,
          message: "Required fields cannot be empty",
        });
      }

      let video = await Videos.findOne({
        where: {
          videoUrl,
        },
      });

      if (video) {
        throw generateErrorInstance({
          status: 409,
          message: "Video already exists ",
        });
      }
      tags = tags.toString();

      video = await Videos.create({
        videoUrl,
        title,
        description,
        fkChannelId: channelId,
        thumbnail,
        tags,
        category,
      });
      video = await video.toJSON();

      res.status(201).send({ message: "Video Uploaded Successfully", video });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getAllVideos: async function (req, res) {
    try {
      let { channelId } = req.params;
      let videos = await Videos.findAll({
        where: {
          fkChannelId: channelId,
        },
        order: [["createdAt", "DESC"]],
      });
      res.status(201).send(videos);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getSuggestedVideos: async (req, res) => {
    try {
      const { videoId } = req.params;

      const video = await Videos.findOne({
        where: { id: videoId },
      });

      if (!video) {
        return res.status(404).send("Video not found");
      }

      let videoTags = video.tags.split(",").map((tag) => tag.trim());

      const suggestedVideos = await Videos.findAll({
        where: {
          id: { [Op.ne]: videoId },
          tags: {
            [Op.or]: videoTags.map((tag) => ({ [Op.like]: `%${tag}%` })),
          },
        },
        include: [
          {
            model: Channels,
            as: "channel",
            attributes: ["id", "name", "handleBy"],
          },
        ],
      });

      res.status(200).send(suggestedVideos);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  addLike: async function (req, res) {
    const { channelId, videoId } = req.params;

    if (!channelId || !videoId) {
      return res
        .status(400)
        .json({ message: "Channel Id and Video Id are required" });
    }

    try {
      await sequelize.transaction(async (transaction) => {
        const existingLike = await Likes.findOne({
          where: {
            fkChannelId: channelId,
            fkVideoId: videoId,
          },
          transaction,
        });

        const existingDislike = await DisLikes.findOne({
          where: {
            fkChannelId: channelId,
            fkVideoId: videoId,
          },
          transaction,
        });

        if (existingLike) {
          await Videos.update(
            { likes: sequelize.literal("likes - 1") },
            { where: { id: videoId }, transaction, individualHooks: true }
          );

          await Likes.destroy({
            where: {
              fkChannelId: channelId,
              fkVideoId: videoId,
            },
            transaction,
          });

          res.status(200).json({ message: "UnLiked Video Successfully" });
        } else {
          if (existingDislike) {
            await Videos.update(
              { disLikes: sequelize.literal("disLikes - 1") },
              { where: { id: videoId }, transaction, individualHooks: true }
            );

            await DisLikes.destroy({
              where: {
                fkChannelId: channelId,
                fkVideoId: videoId,
              },
              transaction,
            });
          }

          await Videos.update(
            { likes: sequelize.literal("likes + 1") },
            { where: { id: videoId }, transaction, individualHooks: true }
          );

          await Likes.create(
            { fkChannelId: channelId, fkVideoId: videoId },
            { transaction }
          );

          res.status(200).json({ message: "Liked Video Successfully" });
        }
      });
    } catch (error) {
      console.error("Error liking/unLiking:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  findLike: async function (req, res) {
    try {
      const { channelId, videoId } = req.params;

      if (!channelId || !videoId) {
        return res
          .status(400)
          .json({ message: "Channel Id and Video Id are required" });
      }
      const like = await Likes.findOne({
        where: {
          fkChannelId: channelId,
          fkVideoId: videoId,
        },
      });

      if (like) {
        res.status(200).json({ liked: true });
      } else {
        res.status(200).json({ liked: false });
      }
    } catch (error) {
      console.error("Error : ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  addDisLike: async function (req, res) {
    const { channelId, videoId } = req.params;

    if (!channelId || !videoId) {
      return res
        .status(400)
        .json({ message: "Channel Id and Video Id are required" });
    }

    try {
      await sequelize.transaction(async (transaction) => {
        const existingDislike = await DisLikes.findOne({
          where: {
            fkChannelId: channelId,
            fkVideoId: videoId,
          },
          transaction,
        });

        const existingLike = await Likes.findOne({
          where: {
            fkChannelId: channelId,
            fkVideoId: videoId,
          },
          transaction,
        });

        if (existingDislike) {
          await Videos.update(
            { disLikes: sequelize.literal("disLikes - 1") },
            { where: { id: videoId }, transaction, individualHooks: true }
          );

          await DisLikes.destroy({
            where: {
              fkChannelId: channelId,
              fkVideoId: videoId,
            },
            transaction,
          });

          res.status(200).json({ message: "UnDisLiked Video Successfully" });
        } else {
          if (existingLike) {
            await Videos.update(
              { likes: sequelize.literal("likes - 1") },
              { where: { id: videoId }, transaction, individualHooks: true }
            );

            await Likes.destroy({
              where: {
                fkChannelId: channelId,
                fkVideoId: videoId,
              },
              transaction,
            });
          }

          await Videos.update(
            { disLikes: sequelize.literal("disLikes + 1") },
            { where: { id: videoId }, transaction, individualHooks: true }
          );

          await DisLikes.create(
            { fkChannelId: channelId, fkVideoId: videoId },
            { transaction }
          );

          res.status(200).json({ message: "DisLiked Video Successfully" });
        }
      });
    } catch (error) {
      console.error("Error disLiking/unDisLiking:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  findDisLike: async function (req, res) {
    try {
      const { channelId, videoId } = req.params;

      if (!channelId || !videoId) {
        return res
          .status(400)
          .json({ message: "Channel Id and Video Id are required" });
      }
      const disLike = await DisLikes.findOne({
        where: {
          fkChannelId: channelId,
          fkVideoId: videoId,
        },
      });

      if (disLike) {
        res.status(200).json({ disLiked: true });
      } else {
        res.status(200).json({ disLiked: false });
      }
    } catch (error) {
      console.error("Error : ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getOne: async function (req, res) {
    try {
      let { videoId } = req.params;
      let video = await Videos.findOne({
        where: {
          id: videoId,
        },
        include: [
          {
            model: Channels,
            as: "channel",
            attributes: ["id", "name", "totalSubscribers"],
            include: {
              model: Users,
              as: "user",
              attributes: ["profileUrl"],
            },
          },
        ],
      });
      res.status(200).send(video);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getLatestVideo: async function (req, res) {
    try {
      const { channelId } = req.params;
      let video = await Videos.findOne({
        where: {
          fkChannelId: channelId,
        },
        order: [["createdAt", "DESC"]],
      });
      res.status(200).send(video);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getCategoryVideo: async function (req, res) {
    const { query } = req.query;
    if (!query) {
      return res.status(400).send("Query parameter is missing");
    }
    try {
      let videos = await Videos.findAll({
        where: {
          category: query,
        },
        include : [
          {
            model : Channels,
            as : "channel",
            attributes : ["id","name","handleBy","totalSubscribers"],
            include : {
              model : Users,
              as : "user",
              attributes : ["profileUrl"]
            }
          }
        ],
        order: [["createdAt", "DESC"]],
      });

      console.log("Retrieved videos:", videos); // Debugging line


      res.status(200).send({ videos });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  findAllSubscriptionVideos: async function (req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User Id are required" });
      }
      let subscriptions = await ChannelSubscribers.findAll({
        where: {
          fkUserId: userId,
        },
      });
      subscriptions = subscriptions.map(
        (subscription) => subscription.fkChannelId
      );
      const videos = await Videos.findAll({
        where: {
          fkChannelId: subscriptions,
        },
        include: [
          {
            model: Channels,
            as: "channel",
            attributes: ["id", "name"],
            include: {
              model: Users,
              as: "user",
              attributes: ["profileUrl"],
            },
          },
        ],
      });

      res.status(200).send(videos);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  },
  edit: async function (req, res) {
    try {
      let { title, description, tags, category, thumbnail } = req.body;
      const { videoId } = req.params;

      if (!videoId) {
        throw generateErrorInstance({
          status: 404,
          message: "Video Id is required",
        });
      }
      tags = tags.toString();

      let video = await Videos.findOne({
        where: {
          id: videoId,
        },
      });

      if (!video) {
        return res.status(404).send("Video not found");
      }
      await video.update({
        title,
        description,
        category,
        tags,
        thumbnail,
      });

      res.status(200).send({ message: "Video updated successfully", video });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  searchVideos: async function (req, res) {
    const { query } = req.query;

    try {
      const videos = await Videos.findAll({
        include: [
          {
            model: Channels,
            as: "channel",
            include: {
              model: Users,
              as: "user",
              attributes: ["profileUrl"],
            },
          },
        ],
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } }, // Search in video title
            { tags: { [Op.like]: `%${query}%` } }, // Search in video tags
            { category: { [Op.like]: `%${query}%` } }, // Search in video tags
          ],
        },
      });
      const channels = await Channels.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { tags: { [Op.like]: `%${query}%` } },
          ],
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["profileUrl"],
          },
        ],
      });

      res.json({ videos, channels });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  countView: async function (req, res) {
    const { userId, videoId } = req.params;

    if (!userId || !videoId) {
      return res
        .status(400)
        .json({ message: "User Id and Video Id are required" });
    }

    try {
      await sequelize.transaction(async (transaction) => {
        const existingView = await Views.findOne({
          where: {
            fkUserId: userId,
            fkVideoId: videoId,
          },
          transaction,
        });

        if (!existingView) {
          await Videos.update(
            { views: sequelize.literal("views + 1") },
            { where: { id: videoId }, transaction, individualHooks: true }
          );
          await Views.create(
            { fkUserId: userId, fkVideoId: videoId },
            { transaction }
          );

          res.status(200).json({ message: "View counted Successfully" });
        }
      });
    } catch (error) {
      console.error("Error counting view", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
