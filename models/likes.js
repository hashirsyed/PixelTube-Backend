"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("likes", {
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
      fkVideoId: {
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

  Likes.beforeCreate(async (like) => {
    like.dataValues.createdAt = moment().unix();
    like.dataValues.updatedAt = moment().unix();
  });
  Likes.beforeUpdate(async (like) => {
    like.dataValues.updatedAt = moment().unix();
  });
  Likes.associate = (models) => {
    Likes.belongsTo(models.Videos, {
      foreignKey: "fkVideoId",
      as: "video",
    });
    Likes.belongsTo(models.Channels, {
      foreignKey: "fkChannelId",
      as: "channel",
    });
  };
  return Likes;
};
