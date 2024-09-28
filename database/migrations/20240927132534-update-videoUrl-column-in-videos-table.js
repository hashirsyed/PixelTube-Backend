"use strict";
const {DataTypes} =require("sequelize")

const table = "videos";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"videoUrl",{
      allowNull: false,
        type: DataTypes.TEXT,
    }
    );

  },
  down: async function (queryInterface) {
    await queryInterface.changeColumn(table);
  },
};