"use strict";
const {DataTypes} = require("sequelize")

const table = "videos";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"thumbnail",{
        type: DataTypes.TEXT,
        allowNull: false,
      
    }
    );

  },
  down: async function (queryInterface) {
    await queryInterface.changeColumn(table);
  },
};