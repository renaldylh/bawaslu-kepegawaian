"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Skill.belongsTo(models.Biodata, {
        foreignKey: "biodata_id",
      });
    }
  }
  Skill.init(
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
      skill_description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 1000],
            msg: "Skill description cannot exceed 1000 characters",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Skill",
    }
  );
  return Skill;
};
