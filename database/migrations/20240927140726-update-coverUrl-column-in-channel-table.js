"use strict";
const {DataTypes} =require("sequelize")

const table = "channels";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"coverUrl",{
      allowNull: true,
        type: DataTypes.TEXT,
        defaultValue : ""
    }
    );

  },
  down: async function (queryInterface) {
    await queryInterface.changeColumn(table);
  },
};