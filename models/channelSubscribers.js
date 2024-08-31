"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const ChannelSubscribers = sequelize.define("channel_subscribers", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fkChannelId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      fkUserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
  });

  ChannelSubscribers.beforeCreate(async (channelsubscriber) => {
    channelsubscriber.dataValues.createdAt = moment().unix();
    channelsubscriber.dataValues.updatedAt = moment().unix();
  });
  ChannelSubscribers.beforeUpdate(async (channelsubscriber) => {
    channelsubscriber.dataValues.updatedAt = moment().unix();
  });
  ChannelSubscribers.associate = (models) => {
    ChannelSubscribers.belongsTo(models.Users, {
      foreignKey: "fkUserId",
      as: "user",
    });
    ChannelSubscribers.belongsTo(models.Channels, {
      foreignKey: "fkChannelId",
      as: "channel",
    });
  };
  return ChannelSubscribers;
};
