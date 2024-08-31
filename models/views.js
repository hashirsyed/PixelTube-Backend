"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Views = sequelize.define("views", {
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
      fkUserId: {
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

  Views.beforeCreate(async (view) => {
    view.dataValues.createdAt = moment().unix();
    view.dataValues.updatedAt = moment().unix();
  });
  Views.beforeUpdate(async (view) => {
    view.dataValues.updatedAt = moment().unix();
  });
  Views.associate = (models) => {
    Views.belongsTo(models.Users, {
      foreignKey: "fkUserId",
      as: "user",
    });
    Views.belongsTo(models.Videos, {
      foreignKey: "fkVideoId",
      as: "video",
    });
  };
  return Views;
};
