"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const PVideo = sequelize.define("p_videos", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      videoUrl: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fkChannelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tags : {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.ENUM('Entertainment','Nasheeds', 'Gaming', 'News', 'Sports', 'Education'),
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

  PVideo.beforeCreate(async (pVideo) => {
    pVideo.dataValues.createdAt = moment().unix();
    pVideo.dataValues.updatedAt = moment().unix();
  });
  PVideo.beforeUpdate(async (pVideo) => {
    pVideo.dataValues.updatedAt = moment().unix();
  });
  PVideo.associate = (models) => {
    PVideo.belongsTo(models.Channels, {
      foreignKey: "fkChannelId",
      as: "channel",
    });
  };
  
  return PVideo;
};
