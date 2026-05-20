"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Biodata", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      applied_position: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      birth_place: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      birth_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      religion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      blood_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      marital_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address_id: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      address_current: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      personal_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emergency_contact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      willing_to_relocate: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      expected_salary: {
        type: Sequelize.DECIMAL,
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
    await queryInterface.dropTable("Biodata");
  },
};
