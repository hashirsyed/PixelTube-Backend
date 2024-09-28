"use strict";
const {DataTypes} =require("sequelize")

const table = "comments";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"content",{
      allowNull: false,
        type: DataTypes.TEXT,
    }
    );

  },
  down: async function (queryInterface) {
    await queryInterface.changeColumn(table);
  },
};