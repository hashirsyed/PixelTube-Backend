"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("comments", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fkVideoId : {
        allowNull : false,
        type : DataTypes.INTEGER,
      },
      fkChannelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      createdAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
  });

  Comment.beforeCreate(async (comment) => {
    comment.dataValues.createdAt = moment().unix();
    comment.dataValues.updatedAt = moment().unix();
  });
  Comment.beforeUpdate(async (comment) => {
    comment.dataValues.updatedAt = moment().unix();
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.Channels, {
      foreignKey: "fkChannelId",
      as: "channel",
    });
    Comment.belongsTo(models.Videos, {
      foreignKey: "fkVideoId",
      as: "video",
    });
  };
  return Comment;
};
