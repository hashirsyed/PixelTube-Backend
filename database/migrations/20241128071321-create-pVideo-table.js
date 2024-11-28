"use strict";
const {DataTypes} =require("sequelize")

const table = "p_videos";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      videoUrl: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fkChannelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tags : {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.ENUM('Entertainment','Nasheeds', 'Gaming', 'News', 'Sports', 'Education'),
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