import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { cookieHelper } from "../utils/cookieHelper";

export default function CreateBiodata() {
  const [formData, setFormData] = useState({
    // Personal Information
    applied_position: "",
    full_name: "",
    id_number: "",
    birth_place: "",
    birth_date: "",
    gender: "",
    religion: "",
    blood_type: "",
    marital_status: "",
    address_id: "",
    address_current: "",
    personal_email: "",
    phone_number: "",
    emergency_contact: "",
    willing_to_relocate: false,
    expected_salary: "",
    // Skills
    skills: "",
  });

  const [educations, setEducations] = useState([
    {
      education_level: "",
      institution_name: "",
      major: "",
      graduation_year: "",
      gpa: "",
    },
  ]);

  const [trainings, setTrainings] = useState([
    {
      course_name: "",
      has_certificate: false,
      year: "",
    },
  ]);

  const [workExperiences, setWorkExperiences] = useState([
    {
      company_name: "",
      last_position: "",
      last_salary: "",
      last_year: "",
    },
  ]);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducations = [...educations];
    newEducations[index][field] = value;
    setEducations(newEducations);
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        education_level: "",
        institution_name: "",
        major: "",
        graduation_year: "",
        gpa: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    if (educations.length > 1) {
      setEducations(educations.filter((_, i) => i !== index));
    }
  };

  const handleTrainingChange = (index, field, value) => {
    const newTrainings = [...trainings];
    if (field === "has_certificate") {
      newTrainings[index][field] = value;
    } else {
      newTrainings[index][field] = value;
    }
    setTrainings(newTrainings);
  };

  const addTraining = () => {
    setTrainings([
      ...trainings,
      {
        course_name: "",
        has_certificate: false,
        year: "",
      },
    ]);
  };

  const removeTraining = (index) => {
    if (trainings.length > 1) {
      setTrainings(trainings.filter((_, i) => i !== index));
    }
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperiences = [...workExperiences];
    newWorkExperiences[index][field] = value;
    setWorkExperiences(newWorkExperiences);
  };

  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        company_name: "",
        last_position: "",
        last_salary: "",
        last_year: "",
      },
    ]);
  };

  const removeWorkExperience = (index) => {
    if (workExperiences.length > 1) {
      setWorkExperiences(workExperiences.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = cookieHelper.getAccessToken();
      const submitData = {
        ...formData,
        educations: educations.filter(
          (edu) => edu.institution_name.trim() !== ""
        ),
        trainings: trainings.filter(
          (training) => training.course_name.trim() !== ""
        ),
        work_experiences: workExperiences.filter(
          (work) => work.company_name.trim() !== ""
        ),
        skills:
          formData.skills.trim() !== ""
            ? [{ skill_description: formData.skills }]
            : [],
      };

      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_API_URL || "http://localhost:3030"}/profiles`,
        data: submitData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Berhasil",
        text: "Data biodata berhasil disimpan!",
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      let message = "Terjadi kesalahan!";
      if (error && error.response && error.response.data) {
        message = error.response.data.message;
      }
      console.log(error);
      Swal.fire({
        title: "Gagal",
        text: message,
        icon: "error",
      });
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-dark mb-1">Buat Biodata Baru</h2>
              <p className="text-muted mb-0">
                Lengkapi seluruh data informasi personal dan riwayat hidup Anda
              </p>
            </div>
            <Link to="/" className="btn btn-outline-secondary">
              Batal
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 text-dark">Informasi Pribadi</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">
                      Jabatan yang Dilamar / Diemban *
                    </label>
                    <input
                      type="text"
                      name="applied_position"
                      className="form-control"
                      placeholder="Contoh: Staf IT, Analis Hukum, Pengawas Kecamatan"
                      value={formData.applied_position}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Nama Lengkap *</label>
                    <input
                      type="text"
                      name="full_name"
                      className="form-control"
                      placeholder="Ketik nama lengkap sesuai KTP"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Nomor KTP (NIK) *</label>
                    <input
                      type="text"
                      name="id_number"
                      className="form-control"
                      placeholder="Masukkan 16 digit NIK Anda"
                      value={formData.id_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">
                      Tempat & Tanggal Lahir *
                    </label>
                    <div className="row">
                      <div className="col-6">
                        <input
                          type="text"
                          name="birth_place"
                          className="form-control"
                          placeholder="Tempat lahir"
                          value={formData.birth_place}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="date"
                          name="birth_date"
                          className="form-control"
                          value={formData.birth_date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Jenis Kelamin *</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Male">Laki-laki</option>
                      <option value="Female">Perempuan</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Agama</label>
                    <select
                      name="religion"
                      className="form-select"
                      value={formData.religion}
                      onChange={handleInputChange}
                    >
                      <option value="">Pilih Agama</option>
                      <option value="Islam">Islam</option>
                      <option value="Christianity">Kristen Protestan</option>
                      <option value="Catholicism">Katolik</option>
                      <option value="Hinduism">Hindu</option>
                      <option value="Buddhism">Buddha</option>
                      <option value="Confucianism">Konghucu</option>
                      <option value="Other">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">Golongan Darah</label>
                    <select
                      name="blood_type"
                      className="form-select"
                      value={formData.blood_type}
                      onChange={handleInputChange}
                    >
                      <option value="">Pilih golongan darah</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">
                      Status Pernikahan *
                    </label>
                    <select
                      name="marital_status"
                      className="form-select"
                      value={formData.marital_status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Pilih status pernikahan</option>
                      <option value="Single">Belum Kawin</option>
                      <option value="Married">Kawin</option>
                      <option value="Divorced">Cerai Hidup</option>
                      <option value="Widowed">Cerai Mati</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark">Alamat (KTP) *</label>
                  <textarea
                    name="address_id"
                    className="form-control"
                    rows="2"
                    placeholder="Tuliskan alamat lengkap sesuai kartu identitas (KTP)"
                    value={formData.address_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark">
                    Alamat Domisili Sekarang *
                  </label>
                  <textarea
                    name="address_current"
                    className="form-control"
                    rows="2"
                    placeholder="Tuliskan alamat tempat tinggal Anda saat ini"
                    value={formData.address_current}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">
                      Alamat Email Pribadi *
                    </label>
                    <input
                      type="email"
                      name="personal_email"
                      className="form-control"
                      placeholder="nama@email.com"
                      value={formData.personal_email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">
                      Nomor Telepon (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      className="form-control"
                      placeholder="Contoh: 0812XXXXXXXX"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">
                      Kontak Darurat (Nama & Hubungan)
                    </label>
                    <input
                      type="tel"
                      name="emergency_contact"
                      className="form-control"
                      placeholder="Contoh: Ibu Rahma (0813XXXXXXXX)"
                      value={formData.emergency_contact}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-dark">
                      Gaji yang Diharapkan (Rp) *
                    </label>
                    <input
                      type="number"
                      name="expected_salary"
                      className="form-control"
                      placeholder="Contoh: 5000000"
                      value={formData.expected_salary}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="willing_to_relocate"
                      className="form-check-input"
                      checked={formData.willing_to_relocate}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label text-dark">
                      Bersedia ditempatkan di kantor Bawaslu wilayah mana saja
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 text-dark">Riwayat Pendidikan</h5>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={addEducation}
                  >
                    + Tambah Pendidikan
                  </button>
                </div>
              </div>
              <div className="card-body">
                {educations.map((education, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Pendidikan {index + 1}</h6>
                      {educations.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeEducation(index)}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <label className="form-label text-muted">
                          Tingkat Pendidikan
                        </label>
                        <select
                          className="form-select"
                          value={education.education_level}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "education_level",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Pilih Tingkat</option>
                          <option value="Elementary">SD / Sederajat</option>
                          <option value="Middle School">SMP / Sederajat</option>
                          <option value="High School">SMA / SMK / Sederajat</option>
                          <option value="Diploma">Diploma (D1/D2/D3)</option>
                          <option value="Bachelor">Sarjana (S1)</option>
                          <option value="Master">Magister (S2)</option>
                          <option value="Doctorate">Doktor (S3)</option>
                        </select>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label text-muted">
                          Nama Institusi / Sekolah
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={education.institution_name}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "institution_name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <label className="form-label text-muted">Jurusan</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Ilmu Hukum, IT"
                          value={education.major}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "major",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <label className="form-label text-muted">
                          Tahun Lulus
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Contoh: 2023"
                          value={education.graduation_year}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "graduation_year",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <label className="form-label text-muted">IPK / Nilai</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          placeholder="Contoh: 3.75"
                          value={education.gpa}
                          onChange={(e) =>
                            handleEducationChange(index, "gpa", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 text-dark">Riwayat Pelatihan & Sertifikasi</h5>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={addTraining}
                  >
                    + Tambah Pelatihan
                  </button>
                </div>
              </div>
              <div className="card-body">
                {trainings.map((training, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Pelatihan {index + 1}</h6>
                      {trainings.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeTraining(index)}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label text-muted">
                          Nama Kursus / Pelatihan / Seminar
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Pelatihan Sertifikasi Pengawas Pemilu"
                          value={training.course_name}
                          onChange={(e) =>
                            handleTrainingChange(
                              index,
                              "course_name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label text-muted">Tahun</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Contoh: 2023"
                          value={training.year}
                          onChange={(e) =>
                            handleTrainingChange(index, "year", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label text-muted">
                          Sertifikat
                        </label>
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={training.has_certificate}
                            onChange={(e) =>
                              handleTrainingChange(
                                index,
                                "has_certificate",
                                e.target.checked
                              )
                            }
                          />
                          <label className="form-check-label">
                            Memiliki sertifikat
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 text-dark">Pengalaman Kerja</h5>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={addWorkExperience}
                  >
                    + Tambah Pengalaman Kerja
                  </button>
                </div>
              </div>
              <div className="card-body">
                {workExperiences.map((work, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Pengalaman Kerja {index + 1}</h6>
                      {workExperiences.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeWorkExperience(index)}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label text-muted">
                          Nama Perusahaan / Instansi
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Panwaslu, KPU, atau swasta"
                          value={work.company_name}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              "company_name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label text-muted">
                          Jabatan Terakhir
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Staf Administrasi, Panitia Ad Hoc"
                          value={work.last_position}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              "last_position",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label text-muted">
                          Gaji Terakhir (Rp)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Contoh: 4000000"
                          value={work.last_salary}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              "last_salary",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <label className="form-label text-muted">Tahun</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Contoh: 2023"
                          value={work.last_year}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              "last_year",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 text-dark">Keahlian & Keterampilan</h5>
              </div>
              <div className="card-body">
                <label className="form-label text-dark">
                  Tuliskan keahlian & keterampilan yang saat ini anda miliki
                </label>
                <textarea
                  name="skills"
                  className="form-control"
                  rows="4"
                  placeholder="Contoh: Manajemen Pengawasan Pemilu, Analisis Regulasi, Microsoft Office, Pemrograman PHP, dll."
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="d-flex justify-content-end gap-2">
              <Link to="/" className="btn btn-outline-secondary">
                Batal
              </Link>
              <button type="submit" className="btn btn-dark">
                Simpan Biodata
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
