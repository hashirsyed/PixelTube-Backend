"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define("channels", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    bio: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    coverUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    handleBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalSubscribers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    fkUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: false,
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

  Channel.beforeCreate(async (channel) => {
    channel.dataValues.createdAt = moment().unix();
    channel.dataValues.updatedAt = moment().unix();
  });
  Channel.beforeUpdate(async (channel) => {
    channel.dataValues.updatedAt = moment().unix();
  });
  Channel.associate = (models) => {
    Channel.belongsTo(models.Users, {
      foreignKey: "fkUserId",
      as: "user",
    });
    Channel.belongsToMany(models.Users, {
      through: models.ChannelSubscribers,
      foreignKey: "fkUserId",
      as: "users",
    });
    Channel.hasMany(models.Videos, { foreignKey: "fkChannelId", as: "video" });
    Channel.hasMany(models.ChannelSubscribers, {
      foreignKey: "fkChannelId",
      as: "channelsubscriber",
    });
    Channel.belongsToMany(models.Videos, {
      through : models.Comments,
      foreignKey: "fkChannelId",
      as: "channel_video",
    });
  };
  return Channel;
};
