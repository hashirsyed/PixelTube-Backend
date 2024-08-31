"use strict";
const {DataTypes} =require("sequelize")

const table = "videos";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"category",{
      type: DataTypes.ENUM('Entertainment','Nasheeds', 'Gaming', 'News', 'Sports', 'Education'),
        allowNull: false,
    }
    );

  },
  down: async function (queryInterface) {
    await queryInterface.changeColumn(table);
  },
};