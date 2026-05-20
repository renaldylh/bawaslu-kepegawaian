"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Education extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Education.belongsTo(models.Biodata, {
        foreignKey: "biodata_id",
      });
    }
  }
  Education.init(
    {
      biodata_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Biodata ID is required",
          },
          notEmpty: {
            msg: "Biodata ID is required",
          },
        },
      },
      education_level: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Education level is required",
          },
          notEmpty: {
            msg: "Education level is required",
          },
          isIn: {
            args: [
              [
                "Elementary",
                "Middle School",
                "High School",
                "Diploma",
                "Bachelor",
                "Master",
                "Doctorate",
              ],
            ],
            msg: "Invalid education level",
          },
        },
      },
      institution_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Institution name is required",
          },
          notEmpty: {
            msg: "Institution name is required",
          },
        },
      },
      major: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      graduation_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Graduation year is required",
          },
          min: {
            args: [1950],
            msg: "Graduation year must be after 1950",
          },
          max: {
            args: [new Date().getFullYear() + 10],
            msg: "Graduation year cannot be more than 10 years in the future",
          },
        },
      },
      gpa: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          min: {
            args: [0.0],
            msg: "GPA must be positive",
          },
          max: {
            args: [4.0],
            msg: "GPA cannot exceed 4.0",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Education",
    }
  );
  return Education;
};
