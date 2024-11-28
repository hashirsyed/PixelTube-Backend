"use strict";
const {DataTypes} =require("sequelize")

const table = "p_channels";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      bio: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      coverUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      handleBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fkUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tags: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    });

  },
  down: async function (queryInterface) {
    await queryInterface.dropTable(table);
  },
};