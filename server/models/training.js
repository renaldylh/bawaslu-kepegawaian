"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Training extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Training.belongsTo(models.Biodata, {
        foreignKey: "biodata_id",
      });
    }
  }
  Training.init(
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
      course_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Course name is required",
          },
          notEmpty: {
            msg: "Course name is required",
          },
        },
      },
      has_certificate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          notNull: {
            msg: "Certificate status is required",
          },
        },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Training year is required",
          },
          min: {
            args: [1980],
            msg: "Training year must be after 1980",
          },
          max: {
            args: [new Date().getFullYear()],
            msg: "Training year cannot be in the future",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Training",
    }
  );
  return Training;
};
