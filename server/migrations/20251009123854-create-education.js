"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Education", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      biodata_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Biodata",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      education_level: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      institution_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      major: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      graduation_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      gpa: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Education");
  },
};
