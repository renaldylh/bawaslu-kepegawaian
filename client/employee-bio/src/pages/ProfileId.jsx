import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { cookieHelper } from "../utils/cookieHelper";

export default function ProfileId() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const token = cookieHelper.getAccessToken();
      let url, isOwn;

      if (id) {
        // get ProfileById (Admin only)
        url = `${import.meta.env.VITE_API_URL || "http://localhost:3030"}/profiles/${id}`;
        isOwn = false;
      } else {
        // get MyProfile
        url = `${import.meta.env.VITE_API_URL || "http://localhost:3030"}/`;
        isOwn = true;
      }

      setIsOwnProfile(isOwn);

      const response = await axios({
        method: "GET",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(response.data);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        cookieHelper.removeAccessToken();
        navigate("/login");
      } else if (error.response?.status === 404 && id) {
        // User tidak ditemukan
        setProfileData({
          error: "User not found",
          isNotFound: true,
        });
      } else if (error.response?.status === 403 && id) {
        // Validasi role
        setProfileData({
          error:
            "Access denied. Admin privileges required to view other profiles.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const accountType = isOwnProfile ? "Anda" : "pengguna ini";
    const confirmText = isOwnProfile
      ? "Ya, hapus akun saya"
      : "Ya, hapus akun ini";

    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: `Tindakan ini akan menghapus akun ${accountType} secara permanen beserta seluruh data biodata terkait. Tindakan ini tidak dapat dibatalkan!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: confirmText,
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = cookieHelper.getAccessToken();
        let url;

        if (isOwnProfile) {
          // Jika owner hapus menggunakan ID dari profileData
          const userId =
            profileData.id ||
            profileData.userId ||
            (profileData.Biodata && profileData.Biodata[0]?.user_id);
          url = `${import.meta.env.VITE_API_URL || "http://localhost:3030"}/profiles/${userId}`;
          print("Deleting own profile, user ID:", userId);
        } else {
          // Jika admin hapus menggunakan ID dari req.params
          url = `${import.meta.env.VITE_API_URL || "http://localhost:3030"}/profiles/${id}`;
          print("Admin deleting user profile, user ID:", id);
        }

        await axios({
          method: "DELETE",
          url: url,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isOwnProfile) {
          cookieHelper.removeAccessToken();
          Swal.fire({
            title: "Akun Dihapus",
            text: "Akun Anda telah berhasil dihapus secara permanen.",
            icon: "success",
          }).then(() => {
            navigate("/register");
          });
        } else {
          Swal.fire({
            title: "Akun Dihapus",
            text: "Akun pengguna telah berhasil dihapus secara permanen.",
            icon: "success",
          }).then(() => {
            navigate("/profiles");
          });
        }
      } catch (error) {
        console.error("Delete account error:", error);
        let errorMessage = "Gagal menghapus akun. Silakan coba lagi.";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        Swal.fire({
          title: "Gagal",
          text: errorMessage,
          icon: "error",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Handle access denied error
  if (profileData && profileData.error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <div className="text-danger mb-3">
                  <i
                    className="bi bi-shield-exclamation"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <h4 className="text-danger mb-3">
                  {profileData.isNotFound
                    ? "Pengguna Tidak Ditemukan"
                    : "Akses Dibatasi"}
                </h4>
                <p className="text-muted mb-4">
                  {profileData.error === "Access denied. Admin privileges required to view other profiles."
                    ? "Akses ditolak. Diperlukan hak akses Admin untuk melihat biodata pengguna lain."
                    : profileData.error}
                </p>
                <Link to="/" className="btn btn-dark me-2">
                  Kembali ke Profil Saya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    profileData &&
    (!profileData.Biodata || profileData.Biodata.length === 0) &&
    !profileData.error
  ) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5">
              <h3 className="text-muted mb-4">Data Biodata Belum Ada</h3>
              <p className="text-muted mb-4">
                {(() => {
                  if (isOwnProfile) {
                    return "Anda belum mengisi data biodata pegawai Anda.";
                  } else {
                    return "Pegawai ini belum mengisi data biodata pribadinya.";
                  }
                })()}
              </p>
              <div className="d-flex gap-2 justify-content-center">
                {isOwnProfile ? (
                  <>
                    <Link to="/create-biodata" className="btn btn-dark">
                      Isi Biodata Sekarang
                    </Link>
                    <button
                      onClick={handleDeleteAccount}
                      className="btn btn-outline-danger"
                    >
                      Hapus Akun
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleDeleteAccount}
                      className="btn btn-outline-danger"
                    >
                      Hapus Akun
                    </button>
                    <Link to="/profiles" className="btn btn-outline-dark">
                      Kembali ke Daftar Pegawai
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const biodata = profileData.Biodata[0];

  const translateEducation = (level) => {
    const mapping = {
      "Elementary": "SD / Sederajat",
      "Middle School": "SMP / Sederajat",
      "High School": "SMA / SMK / Sederajat",
      "Diploma": "Diploma (D1/D2/D3)",
      "Bachelor": "Sarjana (S1)",
      "Master": "Magister (S2)",
      "Doctorate": "Doktor (S3)"
    };
    return mapping[level] || level || "Tidak ditentukan";
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-dark mb-0">
                {(() => {
                  if (isOwnProfile) {
                    return "Profil Saya";
                  } else {
                    return biodata.full_name || "Profil Pegawai";
                  }
                })()}
              </h2>
              {!isOwnProfile && (
                <p className="text-muted mb-0">Detail Biodata Pegawai Bawaslu</p>
              )}
            </div>
            <div className="d-flex gap-2">
              {isOwnProfile && (
                <>
                  <Link
                    to={`/update-biodata/${profileData.id}`}
                    className="btn btn-outline-dark"
                  >
                    Perbarui Profil
                  </Link>
                  <button
                    onClick={handleDeleteAccount}
                    className="btn btn-outline-danger"
                  >
                    Hapus Akun
                  </button>
                </>
              )}
              {!isOwnProfile && (
                <>
                  <Link
                    to={`/update-biodata/${id}`}
                    className="btn btn-outline-dark"
                  >
                    Perbarui Profil
                  </Link>
                  <button
                    onClick={handleDeleteAccount}
                    className="btn btn-outline-danger"
                  >
                    Hapus Akun
                  </button>
                  <Link to="/profiles" className="btn btn-outline-secondary">
                    Kembali ke Daftar Pegawai
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 text-dark">Informasi Pribadi</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      Jabatan yang Dilamar / Diemban
                    </label>
                    <p className="mb-0 fw-medium">{biodata.applied_position}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Nama Lengkap</label>
                    <p className="mb-0 fw-medium">{biodata.full_name}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Nomor KTP (NIK)</label>
                    <p className="mb-0 fw-medium">{biodata.id_number}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      Tempat & Tanggal Lahir
                    </label>
                    <p className="mb-0 fw-medium">
                      {biodata.birth_place},{" "}
                      {new Date(biodata.birth_date).toLocaleDateString("id-ID", {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Jenis Kelamin</label>
                    <p className="mb-0 fw-medium">{biodata.gender}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Agama</label>
                    <p className="mb-0 fw-medium">{biodata.religion}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">Golongan Darah</label>
                    <p className="mb-0 fw-medium">{biodata.blood_type}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      Status Pernikahan
                    </label>
                    <p className="mb-0 fw-medium">{biodata.marital_status}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Alamat Email</label>
                    <p className="mb-0 fw-medium">{biodata.personal_email}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      Nomor Telepon
                    </label>
                    <p className="mb-0 fw-medium">{biodata.phone_number}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      Kontak Darurat
                    </label>
                    <p className="mb-0 fw-medium">
                      {biodata.emergency_contact}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      Gaji Diharapkan
                    </label>
                    <p className="mb-0 fw-medium text-success">
                      Rp{" "}
                      {parseInt(biodata.expected_salary).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">Alamat (KTP)</label>
                <p className="mb-0 fw-medium">{biodata.address_id}</p>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">Alamat Domisili Sekarang</label>
                <p className="mb-0 fw-medium">{biodata.address_current}</p>
              </div>
              <div className="mb-0">
                <label className="form-label text-muted">
                  Bersedia Ditempatkan di Luar Kota
                </label>
                <p className="mb-0 fw-medium">
                  <span
                    className={`badge ${(() => {
                      if (biodata.willing_to_relocate) {
                        return "bg-success";
                      } else {
                        return "bg-secondary";
                      }
                    })()}`}
                  >
                    {(() => {
                      if (biodata.willing_to_relocate) {
                        return "Ya";
                      } else {
                        return "Tidak";
                      }
                    })()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 text-dark">Riwayat Pendidikan</h5>
            </div>
            <div className="card-body">
              {biodata.Education && biodata.Education.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Tingkat Pendidikan</th>
                        <th>Nama Institusi</th>
                        <th>Jurusan</th>
                        <th>Tahun Kelulusan</th>
                        <th>IPK / Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {biodata.Education.map((edu) => (
                        <tr key={edu.id}>
                          <td className="fw-medium">{translateEducation(edu.education_level)}</td>
                          <td>{edu.institution_name}</td>
                          <td>{edu.major}</td>
                          <td>{edu.graduation_year}</td>
                          <td>{edu.gpa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">Belum ada riwayat pendidikan yang dicantumkan.</p>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 text-dark">Pengalaman Kerja</h5>
            </div>
            <div className="card-body">
              {biodata.WorkExperiences && biodata.WorkExperiences.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Perusahaan / Instansi</th>
                        <th>Jabatan Terakhir</th>
                        <th>Gaji Terakhir</th>
                        <th>Tahun</th>
                      </tr>
                    </thead>
                    <tbody>
                      {biodata.WorkExperiences.map((work) => (
                        <tr key={work.id}>
                          <td className="fw-medium">{work.company_name}</td>
                          <td>{work.last_position}</td>
                          <td>
                            Rp{" "}
                            {parseInt(work.last_salary).toLocaleString("id-ID")}
                          </td>
                          <td>{work.last_year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">
                  Belum ada riwayat pengalaman kerja yang dicantumkan.
                </p>
              )}
            </div>
          </div>

          {/* Training & Certification */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 text-dark">Pelatihan & Sertifikasi</h5>
            </div>
            <div className="card-body">
              {biodata.Trainings && biodata.Trainings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Nama Kursus / Pelatihan</th>
                        <th>Tahun</th>
                        <th>Status Sertifikat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {biodata.Trainings.map((training) => (
                        <tr key={training.id}>
                          <td className="fw-medium">{training.course_name}</td>
                          <td>{training.year}</td>
                          <td>
                            <span
                              className={`badge ${(() => {
                                if (training.has_certificate) {
                                  return "bg-success";
                                } else {
                                  return "bg-secondary";
                                }
                              })()}`}
                            >
                              {(() => {
                                if (training.has_certificate) {
                                  return "Bersertifikat";
                                } else {
                                  return "Tidak Bersertifikat";
                                }
                              })()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">Belum ada riwayat pelatihan yang dicantumkan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
