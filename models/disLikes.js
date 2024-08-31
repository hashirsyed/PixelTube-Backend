"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const DisLikes = sequelize.define("disLikes", {
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

  DisLikes.beforeCreate(async (disLike) => {
    disLike.dataValues.createdAt = moment().unix();
    disLike.dataValues.updatedAt = moment().unix();
  });
  DisLikes.beforeUpdate(async (disLike) => {
    disLike.dataValues.updatedAt = moment().unix();
  });
  DisLikes.associate = (models) => {
    DisLikes.belongsTo(models.Videos, {
      foreignKey: "fkVideoId",
      as: "video",
    });
    DisLikes.belongsTo(models.Channels, {
      foreignKey: "fkChannelId",
      as: "channel",
    });
  };
  return DisLikes;
};
