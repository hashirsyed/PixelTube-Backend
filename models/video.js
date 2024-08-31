"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define("videos", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      videoUrl: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fkChannelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      disLikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      comments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      thumbnail: {
        type: DataTypes.STRING,
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

  Video.beforeCreate(async (video) => {
    video.dataValues.createdAt = moment().unix();
    video.dataValues.updatedAt = moment().unix();
  });
  Video.beforeUpdate(async (video) => {
    video.dataValues.updatedAt = moment().unix();
  });
  Video.associate = (models) => {
    Video.belongsTo(models.Channels, {
      foreignKey: "fkChannelId",
      as: "channel",
    });
    Video.belongsToMany(models.Channels, {
      through : models.Comments,
      foreignKey: "fkChannelId",
      as: "channel_comments",
    });
    Video.hasMany(models.Comments, { foreignKey: "fkVideoId", as: "comment" });
    Video.belongsToMany(models.Users, {
      through: models.Views,
      foreignKey: "fkVideoId",
      as: "user",
    });
    Video.hasMany(models.Views, {
      foreignKey: "fkVideoId",
      as: "view",
    });
    Video.belongsToMany(models.Playlists, {
      through: models.PlaylistVideos,
      foreignKey: "fkVideoId",
      as: "playlists",
    });
  };
  
  return Video;
};
