"use strict";
const { DataTypes } = require("sequelize");

const table = "videos";

module.exports = {
  up: async function (queryInterface) {
    await queryInterface.addColumn(table, "comments", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },
  down: async function (queryInterface) {
    await queryInterface.removeColumn(table);
  },
};
