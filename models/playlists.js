"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define("playlists", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fkUserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      visibility: {
        type: DataTypes.ENUM('public','private'),
      allowNull: false,
      defaultValue: 'private',
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

  Playlist.beforeCreate(async (playlist) => {
    playlist.dataValues.createdAt = moment().unix();
    playlist.dataValues.updatedAt = moment().unix();
  });
  Playlist.beforeUpdate(async (playlist) => {
    playlist.dataValues.updatedAt = moment().unix();
  });
  Playlist.associate = (models) => {
    Playlist.hasMany(models.PlaylistVideos, {
      foreignKey: "fkPlaylistId",
      as: "playlistvideo",
    });
    Playlist.belongsToMany(models.Videos, {
      through: models.PlaylistVideos,
      foreignKey: "fkVideoId",
      as: "videos",
    });
    Playlist.belongsTo(models.Users, {
      foreignKey: "fkUserId",
      as: "user",
    });
  }
  
  return Playlist;
};
