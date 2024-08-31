"use strict";

const { DataTypes } = require("sequelize");

const table = "videos";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.removeColumn(table,"type");

  },
  down: async function (queryInterface) {
    await queryInterface.addColumn(table, "type", {
      type: DataTypes.ENUM("Video","Pixels"),
      allowNull: false,
    });
  },
};