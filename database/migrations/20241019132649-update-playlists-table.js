"use strict";
const { DataTypes } = require("sequelize");

const table = "playlists";

module.exports = {
  up: async function (queryInterface) {
    await queryInterface.addColumn(table, "visibility", {
      type: DataTypes.ENUM('public','private'),
      allowNull: false,
      defaultValue: 'private',
    });
  },
  down: async function (queryInterface) {
    await queryInterface.removeColumn(table);
  },
};
