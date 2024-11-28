"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    googleSub: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
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

  User.beforeCreate(async (user) => {
    user.dataValues.createdAt = moment().unix();
    user.dataValues.updatedAt = moment().unix();
  });
  User.beforeUpdate(async (user) => {
    user.dataValues.updatedAt = moment().unix();
  });
  User.associate = (models) => {
    User.hasOne(models.Channels, {
      foreignKey: "fkUserId",
      as: "channel",
    });
    User.hasOne(models.PChannels, {
      foreignKey: "fkUserId",
      as: "p_channel",
    });
    User.belongsToMany(models.Channels, {
      through: models.ChannelSubscribers,
      foreignKey: "fkUserId",
      as: "channels",
    });
    User.belongsToMany(models.Videos, {
      through: models.Views,
      foreignKey: "fkUserId",
      as: "view",
    });
      User.hasMany(models.Playlists, {
        foreignKey: "fkUserId",
        as: "playlist",
      });
  };

  return User;
};
