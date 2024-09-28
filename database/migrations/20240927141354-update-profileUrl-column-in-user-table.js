"use strict";
const {DataTypes} = require("sequelize")

const table = "users";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"profileUrl",{
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