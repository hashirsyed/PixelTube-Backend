"use strict";
const {DataTypes} =require("sequelize")

const table = "channels";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"coverUrl",{
      allowNull: false,
        type: DataTypes.TEXT,
    }
    );

  },
  down: async function (queryInterface) {
    await queryInterface.changeColumn(table);
  },
};