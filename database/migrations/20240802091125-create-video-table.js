"use strict";
const {DataTypes} =require("sequelize")

const table = "videos";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      type : {
        allowNull : false,
        type : DataTypes.ENUM('Pixel','Video')
      },
      videoUrl: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fkChannelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      disLikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tags : {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.ENUM('Nasheeds', 'Gaming', 'News', 'Sports', 'Education'),
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