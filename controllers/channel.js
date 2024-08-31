const { Op } = require("sequelize");
const { Channels, sequelize } = require("../models");
const { Users } = require("../models");
const { ChannelSubscribers } = require("../models");
const { generateErrorInstance } = require("../utils");

module.exports = {
  create: async function (req, res) {
    try {
      let { name, bio, handleBy, tags, contactEmail } = req.body;
      const { userId } = req.params;
      if (!name && !bio && !handleBy && !tags && !contactEmail && !userId) {
        throw generateErrorInstance({
          status: 404,
          message: "Required fields cannot be empty",
        });
      }
      tags = tags.toString();
      let channel = await Channels.findOne({
        where: {
          fkUserId: userId,
        },
      });

      if (channel) {
        throw generateErrorInstance({
          status: 409,
          message: "User already have channel",
        });
      }

      channel = await Channels.create({
        name,
        bio,
        handleBy,
        tags,
        contactEmail,
        fkUserId: userId,
      });
      channel = await channel.toJSON();

      res.status(200).send({
        message: "Channel Created Successfully",
        channel,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getMyChannelDetails: async function (req, res) {
    try {
      let { userId } = req.params;
      let channel = await Channels.findOne({
        where: {
          fkUserId: userId,
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["profileUrl"],
          },
        ],
      });

      res.status(201).send({
        channel,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getChannelDetails: async function (req, res) {
    try {
      let { channelId } = req.params;
      let channel = await Channels.findOne({
        where: {
          id: channelId,
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["profileUrl"],
          },
        ],
      });

      res.status(201).send({
        channel,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  edit: async function (req, res) {
    try {
      console.log(req.file);
      let { name, bio, coverUrl, handleBy, tags, contactEmail, profileUrl } =
        req.body;
      const { userId } = req.params;

      if (!userId) {
        throw generateErrorInstance({
          status: 404,
          message: "User Id is required",
        });
      }
      tags = tags.toString();

      let channel = await Channels.findOne({
        where: {
          fkUserId: userId,
        },
      });

      if (!channel) {
        return res.status(404).send("Channel not found");
      }
      await channel.update({
        name,
        bio,
        coverUrl,
        handleBy,
        tags,
        contactEmail,
      });

      let user = await Users.update(
        {
          profileUrl,
        },
        {
          where: {
            id: userId,
          },
          individualHooks: true,
        }
      );

      res
        .status(200)
        .send({ message: "Channel updated successfully", channel, user });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  addSubscriber: async function (req, res) {
    const { userId, channelId } = req.params;

    if (!userId || !channelId) {
      return res
        .status(400)
        .json({ message: "User Id and Channel Id are required" });
    }

    try {
      await sequelize.transaction(async (transaction) => {
        // Check if the user is already subscribed
        const existingSubscription = await ChannelSubscribers.findOne({
          where: {
            fkUserId: userId,
            fkChannelId: channelId,
          },
          transaction,
        });

        if (existingSubscription) {
          // User is already subscribed, so decrement the subscriber count and remove the subscription
          await Channels.update(
            { totalSubscribers: sequelize.literal("totalSubscribers - 1") },
            { where: { id: channelId }, transaction, individualHooks: true }
          );

          await ChannelSubscribers.destroy({
            where: {
              fkUserId: userId,
              fkChannelId: channelId,
            },
            transaction,
          });

          res.status(200).json({ message: "Unsubscribed successfully" });
        } else {
          // User is not subscribed, so increment the subscriber count and add the subscription
          await Channels.update(
            { totalSubscribers: sequelize.literal("totalSubscribers + 1") },
            { where: { id: channelId }, transaction, individualHooks: true }
          );

          await ChannelSubscribers.create(
            { fkChannelId: channelId, fkUserId: userId },
            { transaction }
          );

          res.status(200).json({ message: "Subscribed successfully" });
        }
      });
    } catch (error) {
      console.error("Error subscribing/unsubscribing:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  findSubscriber: async function (req, res) {
    try {
      const { userId, channelId } = req.params;

      if (!userId || !channelId) {
        return res
          .status(400)
          .json({ message: "User Id and Channel Id are required" });
      }
      const subscription = await ChannelSubscribers.findOne({
        where: {
          fkUserId: userId,
          fkChannelId: channelId,
        },
      });

      if (subscription) {
        res.status(200).json({ subscribed: true });
      } else {
        res.status(200).json({ subscribed: false });
      }
    } catch (error) {
      console.error("Error subscribing/unsubscribing:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  findAllSubscriptions: async function (req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "User Id are required" });
      }
      const subscriptions = await ChannelSubscribers.findAll({
        where: {
          fkUserId : userId
        },
        include : [
          {
            model : Channels,
            as : "channel",
            attributes: ["name","handleBy","totalSubscribers"],
            include : {
              model : Users,
              as : "user",
              attributes: ["profileUrl"],
            }
          }
        ]
      });

        res.status(200).json(subscriptions);
    } catch (error) {
      console.error("Error : ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getLatestSubscribers: async function (req, res) {
    try {
      const { channelId } = req.params;
      console.log(`channelId : ${channelId}`)
      let channelSubscribers = await ChannelSubscribers.findAll({
        where: {
          fkChannelId: {
            [Op.ne] : channelId
          },
        },
        order: [["createdAt", "DESC"]],
        limit: 4,
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["profileUrl"],
            include: {
              model: Channels,
              as: "channel",
              attributes: ["id", "name", "totalSubscribers"],
            },
          },
        ],
      });
      res.status(201).send(channelSubscribers);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
};
