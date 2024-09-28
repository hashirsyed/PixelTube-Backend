"use strict";
const {DataTypes} =require("sequelize")

const table = "playlists";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"description",{
      allowNull: false,
        type: DataTypes.TEXT,
        defaultValue : ""
    }
    );

  },
  down: async function (queryInterface) {
    await queryInterface.changeColumn(table);
  },
};