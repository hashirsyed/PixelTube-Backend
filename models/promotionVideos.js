"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const PromotionVideos = sequelize.define("promotion_videos", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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

  PromotionVideos.beforeCreate(async (promotionVideo) => {
    promotionVideo.dataValues.createdAt = moment().unix();
    promotionVideo.dataValues.updatedAt = moment().unix();
  });

  PromotionVideos.beforeUpdate(async (promotionVideo) => {
    promotionVideo.dataValues.updatedAt = moment().unix();
  });

  PromotionVideos.associate = (models) => {
    PromotionVideos.belongsTo(models.Videos, {
      foreignKey: "fkVideoId",
      as: "video",
    });
  };

  return PromotionVideos;
};
