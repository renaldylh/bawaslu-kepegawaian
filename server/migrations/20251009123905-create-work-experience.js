"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("WorkExperiences", {
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
      company_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_position: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_salary: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      last_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("WorkExperiences");
  },
};
