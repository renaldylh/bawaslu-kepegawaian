const { Op } = require("sequelize");
const {
  User,
  Biodata,
  Education,
  WorkExperience,
  Training,
  Skill,
  sequelize,
} = require("../models");

class ProfileController {
  // Get user profile
  static async userProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        include: [
          {
            model: Biodata,
            include: [
              { model: Education },
              { model: WorkExperience },
              { model: Training },
            ],
          },
        ],
      });

      // Cek apakah user ada
      if (!user) {
        throw { name: "Not Found", message: "User not found" };
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  // Get all users (admin only)
  static async getAllUsers(req, res, next) {
    try {
      const { name, educationLevel, position } = req.query;

      // Buat kondisi where untuk Biodata
      let biodataWhere = {};

      // Pencarian berdasarkan nama (partial match, case insensitive)
      if (name) {
        biodataWhere.full_name = { [Op.iLike]: `%${name}%` };
      }

      // Pencarian berdasarkan posisi yang dilamar (partial match, case insensitive)
      if (position) {
        biodataWhere.applied_position = { [Op.iLike]: `%${position}%` };
      }

      // Buat kondisi where untuk Education
      let educationWhere = {};
      if (educationLevel) {
        educationWhere.education_level = { [Op.eq]: educationLevel };
      }

      // Buat opsi include
      const educationInclude = {
        model: Education,
      };

      // Jika filter pendidikan diterapkan, tambahkan kondisi where dan buat required (INNER JOIN)
      if (Object.keys(educationWhere).length > 0) {
        educationInclude.where = educationWhere;
        educationInclude.required = true;
      }

      const biodataInclude = {
        model: Biodata,
        include: [
          educationInclude,
          { model: WorkExperience },
          { model: Training },
        ],
      };

      // Jika filter biodata diterapkan, tambahkan kondisi where
      if (Object.keys(biodataWhere).length > 0) {
        biodataInclude.where = biodataWhere;
      }

      // Jika filter pendidikan diterapkan, buat biodata juga required
      if (Object.keys(educationWhere).length > 0) {
        biodataInclude.required = true;
      }

      const users = await User.findAll({
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        include: [biodataInclude],
      });

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  // Get user by id (admin or owner)
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        include: [
          {
            model: Biodata,
            include: [
              { model: Education },
              { model: WorkExperience },
              { model: Training },
            ],
          },
        ],
      });

      // Cek apakah user ada
      if (!user) {
        throw { name: "Not Found", message: "User not found" };
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  // Post biodata (user and admin only)
  static async createBiodata(req, res, next) {
    const transaction = await sequelize.transaction();

    try {
      const userId = req.user.id;
      const {
        // Biodata fields
        applied_position,
        full_name,
        id_number,
        birth_place,
        birth_date,
        gender,
        religion,
        blood_type,
        marital_status,
        address_id,
        address_current,
        personal_email,
        phone_number,
        emergency_contact,
        willing_to_relocate,
        expected_salary,

        // Related data arrays
        educations = [],
        trainings = [],
        work_experiences = [],
        skills = [],
      } = req.body;

      // Cek apakah user sudah memiliki biodata
      const existingBiodata = await Biodata.findOne({
        where: { user_id: userId },
        transaction,
      });

      if (existingBiodata) {
        throw {
          name: "BadRequest",
          message: "User already has biodata. Use update instead.",
        };
      }

      // Cek apakah id_number sudah digunakan
      const existingIdNumber = await Biodata.findOne({
        where: { id_number },
        transaction,
      });

      if (existingIdNumber) {
        throw { name: "BadRequest", message: "ID number already exists" };
      }

      // Create biodata
      const biodata = await Biodata.create(
        {
          user_id: userId,
          applied_position,
          full_name,
          id_number,
          birth_place,
          birth_date,
          gender,
          religion,
          blood_type,
          marital_status,
          address_id,
          address_current,
          personal_email,
          phone_number,
          emergency_contact,
          willing_to_relocate: willing_to_relocate || false,
          expected_salary,
        },
        { transaction }
      );

      const biodataId = biodata.id;

      // Create educations kalau ada
      if (educations && educations.length > 0) {
        const educationData = educations.map((edu) => ({
          ...edu,
          biodata_id: biodataId,
        }));
        await Education.bulkCreate(educationData, {
          transaction,
          validate: true,
        });
      }

      // Create trainings kalau ada
      if (trainings && trainings.length > 0) {
        const trainingData = trainings.map((training) => ({
          ...training,
          biodata_id: biodataId,
          has_certificate:
            training.has_certificate !== undefined
              ? training.has_certificate
              : false,
        }));
        await Training.bulkCreate(trainingData, {
          transaction,
          validate: true,
        });
      }

      // Create work experiences kalau ada
      if (work_experiences && work_experiences.length > 0) {
        const workExpData = work_experiences.map((workExp) => ({
          ...workExp,
          biodata_id: biodataId,
        }));
        await WorkExperience.bulkCreate(workExpData, {
          transaction,
          validate: true,
        });
      }

      // Create skills kalau ada
      if (skills && skills.length > 0) {
        const skillData = skills.map((skill) => ({
          ...skill,
          biodata_id: biodataId,
        }));
        await Skill.bulkCreate(skillData, {
          transaction,
          validate: true,
        });
      }

      // Commit transaction
      await transaction.commit();

      res.status(201).json({
        message: "Biodata created successfully",
      });
    } catch (error) {
      // Rollback transaction jika terjadi error dan belum di-rollback
      if (!transaction.finished) {
        await transaction.rollback();
      }
      next(error);
    }
  }

  // Update biodata (user and admin only)
  static async updateBiodata(req, res, next) {
    const transaction = await sequelize.transaction();

    try {
      const userId = req.params.id;
      const {
        // Biodata fields
        applied_position,
        full_name,
        id_number,
        birth_place,
        birth_date,
        gender,
        religion,
        blood_type,
        marital_status,
        address_id,
        address_current,
        personal_email,
        phone_number,
        emergency_contact,
        willing_to_relocate,
        expected_salary,

        // Related data arrays
        educations = [],
        trainings = [],
        work_experiences = [],
        skills = [],
      } = req.body;

      // Cari biodata user yang sudah ada
      const existingBiodata = await Biodata.findOne({
        where: { user_id: userId },
        transaction,
      });

      if (!existingBiodata) {
        throw {
          name: "Not Found",
          message: "Biodata not found. Please create biodata first.",
        };
      }

      const biodataId = existingBiodata.id;

      // Update biodata utama
      const updateData = {};
      if (applied_position !== undefined)
        updateData.applied_position = applied_position;
      if (full_name !== undefined) updateData.full_name = full_name;
      if (id_number !== undefined) updateData.id_number = id_number;
      if (birth_place !== undefined) updateData.birth_place = birth_place;
      if (birth_date !== undefined) updateData.birth_date = birth_date;
      if (gender !== undefined) updateData.gender = gender;
      if (religion !== undefined) updateData.religion = religion;
      if (blood_type !== undefined) updateData.blood_type = blood_type;
      if (marital_status !== undefined)
        updateData.marital_status = marital_status;
      if (address_id !== undefined) updateData.address_id = address_id;
      if (address_current !== undefined)
        updateData.address_current = address_current;
      if (personal_email !== undefined)
        updateData.personal_email = personal_email;
      if (phone_number !== undefined) updateData.phone_number = phone_number;
      if (emergency_contact !== undefined)
        updateData.emergency_contact = emergency_contact;
      if (willing_to_relocate !== undefined)
        updateData.willing_to_relocate = willing_to_relocate;
      if (expected_salary !== undefined)
        updateData.expected_salary = expected_salary;

      if (Object.keys(updateData).length > 0) {
        await Biodata.update(updateData, {
          where: { id: biodataId },
          transaction,
        });
      }

      // Handle update education (hanya jika array educations dikirim dalam request)
      if (req.body.hasOwnProperty("educations")) {
        // Hapus education yang sudah ada
        await Education.destroy({
          where: { biodata_id: biodataId },
          transaction,
        });

        // Buat education baru jika ada
        if (educations.length > 0) {
          const educationData = educations.map((edu) => ({
            ...edu,
            biodata_id: biodataId,
          }));
          await Education.bulkCreate(educationData, {
            transaction,
            validate: true,
          });
        }
      }

      // Handle update training (hanya jika array trainings dikirim dalam request)
      if (req.body.hasOwnProperty("trainings")) {
        // Hapus training yang sudah ada
        await Training.destroy({
          where: { biodata_id: biodataId },
          transaction,
        });

        // Buat training baru jika ada
        if (trainings.length > 0) {
          const trainingData = trainings.map((training) => ({
            ...training,
            biodata_id: biodataId,
            has_certificate:
              training.has_certificate !== undefined
                ? training.has_certificate
                : false,
          }));
          await Training.bulkCreate(trainingData, {
            transaction,
            validate: true,
          });
        }
      }

      // Handle update work experience (hanya jika array work_experiences dikirim dalam request)
      if (req.body.hasOwnProperty("work_experiences")) {
        // Hapus work experience yang sudah ada
        await WorkExperience.destroy({
          where: { biodata_id: biodataId },
          transaction,
        });

        // Buat work experience baru jika ada
        if (work_experiences.length > 0) {
          const workExpData = work_experiences.map((workExp) => ({
            ...workExp,
            biodata_id: biodataId,
          }));
          await WorkExperience.bulkCreate(workExpData, {
            transaction,
            validate: true,
          });
        }
      }

      // Handle update skill (hanya jika array skills dikirim dalam request)
      if (req.body.hasOwnProperty("skills")) {
        // Hapus skill yang sudah ada
        await Skill.destroy({
          where: { biodata_id: biodataId },
          transaction,
        });

        // Buat skill baru jika ada
        if (skills.length > 0) {
          const skillData = skills.map((skill) => ({
            ...skill,
            biodata_id: biodataId,
          }));
          await Skill.bulkCreate(skillData, {
            transaction,
            validate: true,
          });
        }
      }

      // Commit transaction
      await transaction.commit();

      res.status(200).json({
        message: "Biodata updated successfully",
      });
    } catch (error) {
      // Rollback transaction jika terjadi error dan belum di-rollback
      if (!transaction.finished) {
        await transaction.rollback();
      }
      next(error);
    }
  }

  // Delete user (user and admin only)
  static async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      await User.destroy({ where: { id: userId } });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProfileController;
