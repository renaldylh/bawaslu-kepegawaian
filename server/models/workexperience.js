"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WorkExperience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WorkExperience.belongsTo(models.Biodata, {
        foreignKey: "biodata_id",
      });
    }
  }
  WorkExperience.init(
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
      company_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Company name is required",
          },
          notEmpty: {
            msg: "Company name is required",
          },
        },
      },
      last_position: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last position is required",
          },
          notEmpty: {
            msg: "Last position is required",
          },
        },
      },
      last_salary: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last salary is required",
          },
          min: {
            args: [0],
            msg: "Last salary must be positive",
          },
        },
      },
      last_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last working year is required",
          },
          min: {
            args: [1980],
            msg: "Last working year must be after 1980",
          },
          max: {
            args: [new Date().getFullYear()],
            msg: "Last working year cannot be in the future",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "WorkExperience",
    }
  );
  return WorkExperience;
};
