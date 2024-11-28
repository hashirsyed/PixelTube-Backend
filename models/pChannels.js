"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const PChannels = sequelize.define("p_channels", {
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
      type: DataTypes.TEXT,
    },
    coverUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    handleBy: {
      type: DataTypes.STRING,
      allowNull: false,
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

  PChannels.beforeCreate(async (pChannel) => {
    pChannel.dataValues.createdAt = moment().unix();
    pChannel.dataValues.updatedAt = moment().unix();
  });
  PChannels.beforeUpdate(async (pChannel) => {
    pChannel.dataValues.updatedAt = moment().unix();
  });
  PChannels.associate = (models) => {
    PChannels.belongsTo(models.Users, {
      foreignKey: "fkUserId",
      as: "user",
    });
  };
  return PChannels;
};
