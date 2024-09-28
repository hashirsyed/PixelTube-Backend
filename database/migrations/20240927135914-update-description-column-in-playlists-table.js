"use strict";
const {DataTypes} =require("sequelize")

const table = "channel";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"coverUrl",{
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