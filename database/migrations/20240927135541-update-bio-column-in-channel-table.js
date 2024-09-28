"use strict";
const {DataTypes} =require("sequelize")

const table = "channels";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"bio",{
      allowNull: false,
        type: DataTypes.TEXT,
    }
    );

  },
  down: async function (queryInterface) {
    await queryInterface.changeColumn(table);
  },
};