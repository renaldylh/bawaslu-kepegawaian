"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Biodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Biodata.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      Biodata.hasMany(models.Education, {
        foreignKey: "biodata_id",
      });
      Biodata.hasMany(models.Training, {
        foreignKey: "biodata_id",
      });
      Biodata.hasMany(models.WorkExperience, {
        foreignKey: "biodata_id",
      });
      Biodata.hasMany(models.Skill, {
        foreignKey: "biodata_id",
      });
    }
  }
  Biodata.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User ID is required",
          },
          notEmpty: {
            msg: "User ID is required",
          },
        },
      },
      applied_position: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Applied position is required",
          },
          notEmpty: {
            msg: "Applied position is required",
          },
        },
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Full name is required",
          },
          notEmpty: {
            msg: "Full name is required",
          },
        },
      },
      id_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "ID number is required",
          },
          notEmpty: {
            msg: "ID number is required",
          },
        },
      },
      birth_place: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Birth place is required",
          },
          notEmpty: {
            msg: "Birth place is required",
          },
        },
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Birth date is required",
          },
          isDate: {
            msg: "Invalid date format",
          },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Gender is required",
          },
          isIn: {
            args: [["Male", "Female"]],
            msg: "Gender must be Male or Female",
          },
        },
      },
      religion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      blood_type: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isIn: {
            args: [["A", "B", "AB", "O"]],
            msg: "Blood type must be A, B, AB, or O",
          },
        },
      },
      marital_status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Marital status is required",
          },
          isIn: {
            args: [["Single", "Married", "Divorced", "Widowed"]],
            msg: "Invalid marital status",
          },
        },
      },
      address_id: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "ID address is required",
          },
          notEmpty: {
            msg: "ID address is required",
          },
        },
      },
      address_current: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Current address is required",
          },
          notEmpty: {
            msg: "Current address is required",
          },
        },
      },
      personal_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Personal email is required",
          },
          notEmpty: {
            msg: "Personal email is required",
          },
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Phone number is required",
          },
          notEmpty: {
            msg: "Phone number is required",
          },
        },
      },
      emergency_contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      willing_to_relocate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          notNull: {
            msg: "Willing to relocate preference is required",
          },
        },
      },
      expected_salary: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg: "Expected salary must be positive",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Biodata",
    }
  );
  return Biodata;
};
