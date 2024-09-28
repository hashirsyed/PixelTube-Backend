"use strict";
const {DataTypes} =require("sequelize")

const table = "videos";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"description",{
      allowNull: false,
        type: DataTypes.TEXT,
    }
    );

  },
  down: async function (queryInterface) {
    await queryInterface.changeColumn(table);
  },
};