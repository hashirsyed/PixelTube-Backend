"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const PlaylistVideos = sequelize.define("playlist_videos", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    fkPlaylistId: {
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

  PlaylistVideos.beforeCreate(async (playlistVideo) => {
    playlistVideo.dataValues.createdAt = moment().unix();
    playlistVideo.dataValues.updatedAt = moment().unix();
  });

  PlaylistVideos.beforeUpdate(async (playlistVideo) => {
    playlistVideo.dataValues.updatedAt = moment().unix();
  });

  PlaylistVideos.associate = (models) => {
    PlaylistVideos.belongsTo(models.Playlists, {
      foreignKey: "fkPlaylistId",
      as: "playlist",
    });
    PlaylistVideos.belongsTo(models.Videos, {
      foreignKey: "fkVideoId",
      as: "video",
    });
  };

  return PlaylistVideos;
};
