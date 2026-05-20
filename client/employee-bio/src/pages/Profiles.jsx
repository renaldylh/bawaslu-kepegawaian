import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { cookieHelper } from "../utils/cookieHelper";

// Debounce function to limit API calls
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export default function AllProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    position: "",
    educationLevel: "",
  });
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL params on component mount
  useEffect(() => {
    const urlName = searchParams.get("name") || "";
    const urlPosition = searchParams.get("position") || "";
    const urlEducation = searchParams.get("educationLevel") || "";

    const filtersFromUrl = {
      name: urlName,
      position: urlPosition,
      educationLevel: urlEducation,
    };

    setSearchFilters(filtersFromUrl);
    fetchAllProfiles(filtersFromUrl);
  }, [searchParams]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((filters) => {
      fetchAllProfiles(filters);
    }, 500),
    []
  );

  // Update URL params when filters change
  const updateUrlParams = (filters) => {
    const newSearchParams = new URLSearchParams();

    if (filters.name?.trim()) {
      newSearchParams.set("name", filters.name.trim());
    }
    if (filters.position?.trim()) {
      newSearchParams.set("position", filters.position.trim());
    }
    if (filters.educationLevel?.trim()) {
      newSearchParams.set("educationLevel", filters.educationLevel.trim());
    }

    setSearchParams(newSearchParams);
  };

  const handleInputChange = (field, value) => {
    const newFilters = {
      ...searchFilters,
      [field]: value,
    };

    setSearchFilters(newFilters);
    updateUrlParams(newFilters);

    // For dropdown (education), search immediately
    // For text inputs, use debounced search
    if (field === "educationLevel") {
      fetchAllProfiles(newFilters);
    } else {
      debouncedSearch(newFilters);
    }
  };

  const handleReset = () => {
    const emptyFilters = { name: "", position: "", educationLevel: "" };
    setSearchFilters(emptyFilters);
    setSearchParams(new URLSearchParams());
    fetchAllProfiles(emptyFilters);
  };

  const fetchAllProfiles = async (filters = {}) => {
    try {
      setIsSearching(true);
      const token = cookieHelper.getAccessToken();

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.name?.trim()) queryParams.append("name", filters.name.trim());
      if (filters.position?.trim())
        queryParams.append("position", filters.position.trim());
      if (filters.educationLevel?.trim())
        queryParams.append("educationLevel", filters.educationLevel.trim());

      const queryString = queryParams.toString();
      const url = `${import.meta.env.VITE_API_URL || "http://localhost:3030"}/profiles${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await axios({
        method: "GET",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfiles(response.data);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        cookieHelper.removeAccessToken();
        navigate("/login");
      } else if (error.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to fetch profiles.");
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <div className="text-danger mb-3">
                  <i
                    className="bi bi-exclamation-triangle"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <h4 className="text-danger mb-3">Akses Dibatasi</h4>
                <p className="text-muted mb-4">{error === "Access denied. Admin privileges required." ? "Akses ditolak. Diperlukan hak akses Admin untuk melihat data seluruh pegawai." : error}</p>
                <Link to="/" className="btn btn-dark">
                  Kembali ke Profil Saya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h2 className="text-dark mb-1">Daftar Pegawai & Pengawas</h2>
              <p className="text-muted mb-0">
                Kelola dan pantau seluruh data biodata pegawai di lingkungan Bawaslu
              </p>
            </div>
            <span className="badge bg-secondary fs-6">
              {profiles.length} Pegawai
            </span>
          </div>

          {/* Search Filters */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title text-dark mb-0">
                  <i className="bi bi-funnel me-2"></i>Pencarian & Filter Data
                </h5>
                <div className="d-flex align-items-center">
                  {isSearching && (
                    <div className="text-muted small me-3">
                      <span
                        className="spinner-border spinner-border-sm me-2 text-danger"
                        role="status"
                      ></span>
                      Mencari...
                    </div>
                  )}
                  {(searchFilters.name ||
                    searchFilters.position ||
                    searchFilters.educationLevel) && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleReset}
                      title="Clear all filters"
                    >
                      <i className="bi bi-x-circle me-1"></i>Bersihkan Filter
                    </button>
                  )}
                </div>
              </div>

              <div className="row g-3">
                {/* Name Search */}
                <div className="col-md-4">
                  <label className="form-label text-muted small">
                    <i className="bi bi-person me-1"></i>Cari berdasarkan Nama
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ketik nama pegawai..."
                      value={searchFilters.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                    {searchFilters.name && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleInputChange("name", "")}
                        title="Clear name filter"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Position Search */}
                <div className="col-md-4">
                  <label className="form-label text-muted small">
                    <i className="bi bi-briefcase me-1"></i>Cari berdasarkan Jabatan
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ketik jabatan/posisi..."
                      value={searchFilters.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                    />
                    {searchFilters.position && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleInputChange("position", "")}
                        title="Clear position filter"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Education Level Filter */}
                <div className="col-md-4">
                  <label className="form-label text-muted small">
                    <i className="bi bi-mortarboard me-1"></i>Saring berdasarkan Pendidikan
                  </label>
                  <select
                    className="form-select"
                    value={searchFilters.educationLevel}
                    onChange={(e) =>
                      handleInputChange("educationLevel", e.target.value)
                    }
                  >
                    <option value="">Semua Tingkat Pendidikan</option>
                    <option value="Elementary">SD / Sederajat</option>
                    <option value="Middle School">SMP / Sederajat</option>
                    <option value="High School">SMA / SMK / Sederajat</option>
                    <option value="Diploma">Diploma (D1/D2/D3)</option>
                    <option value="Bachelor">Sarjana (S1)</option>
                    <option value="Master">Magister (S2)</option>
                    <option value="Doctorate">Doktor (S3)</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchFilters.name ||
                searchFilters.position ||
                searchFilters.educationLevel) && (
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <span className="text-muted small">Filter aktif:</span>
                    {searchFilters.name && (
                      <span className="badge bg-primary">
                        Nama: {searchFilters.name}
                        <button
                          className="btn-close btn-close-white ms-2"
                          onClick={() => handleInputChange("name", "")}
                          style={{ fontSize: "0.7em" }}
                        ></button>
                      </span>
                    )}
                    {searchFilters.position && (
                      <span className="badge bg-success">
                        Jabatan: {searchFilters.position}
                        <button
                          className="btn-close btn-close-white ms-2"
                          onClick={() => handleInputChange("position", "")}
                          style={{ fontSize: "0.7em" }}
                        ></button>
                      </span>
                    )}
                    {searchFilters.educationLevel && (
                      <span className="badge bg-info">
                        Pendidikan: {translateEducation(searchFilters.educationLevel)}
                        <button
                          className="btn-close ms-2"
                          onClick={() =>
                            handleInputChange("educationLevel", "")
                          }
                          style={{ fontSize: "0.7em" }}
                        ></button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {profiles.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <div className="text-muted mb-3">
                  <i
                    className={`bi ${
                      searchFilters.name ||
                      searchFilters.position ||
                      searchFilters.educationLevel
                        ? "bi-search"
                        : "bi-people"
                    }`}
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <h4 className="text-muted mb-3">
                  {searchFilters.name ||
                  searchFilters.position ||
                  searchFilters.educationLevel
                    ? "Data Tidak Ditemukan"
                    : "Belum Ada Data Pegawai"}
                </h4>
                <p className="text-muted">
                  {searchFilters.name ||
                  searchFilters.position ||
                  searchFilters.educationLevel
                    ? "Tidak ada data pegawai yang sesuai dengan filter pencarian Anda."
                    : "Belum ada data pegawai yang terdaftar dalam sistem."}
                </p>
                {(searchFilters.name ||
                  searchFilters.position ||
                  searchFilters.educationLevel) && (
                  <button
                    className="btn btn-outline-dark mt-3"
                    onClick={handleReset}
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="row">
              {profiles.map((user) => {
                const biodata = user.Biodata?.[0];
                return (
                  <div key={user.id} className="col-lg-6 col-xl-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-start justify-content-between mb-3">
                          <div className="flex-grow-1">
                            <h5 className="card-title text-dark mb-1">
                              {biodata?.full_name || "Belum Mengisi Nama"}
                            </h5>
                            <p className="text-muted small mb-0">
                              {user.email}
                            </p>
                          </div>
                          <span className="badge bg-light text-dark border text-capitalize">
                            {user.role}
                          </span>
                        </div>

                        {biodata ? (
                          <div className="mb-3">
                            <div className="mb-2">
                              <span className="text-muted small">
                                Jabatan:
                              </span>
                              <p className="mb-1 fw-medium">
                                {biodata.applied_position}
                              </p>
                            </div>
                            <div className="mb-2">
                              <span className="text-muted small">
                                Pendidikan Terakhir:
                              </span>
                              <p className="mb-1">
                                {translateEducation(biodata.Education?.[0]?.education_level)}
                              </p>
                            </div>
                            <div className="mb-2">
                              <span className="text-muted small">Nomor HP:</span>
                              <p className="mb-1">{biodata.phone_number}</p>
                            </div>
                            <div className="mb-2">
                              <span className="text-muted small">
                                Gaji Diharapkan:
                              </span>
                              <p className="mb-0 fw-medium text-success">
                                {biodata.expected_salary
                                  ? `Rp ${parseInt(
                                      biodata.expected_salary
                                    ).toLocaleString("id-ID")}`
                                  : "Tidak ditentukan"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-3">
                            <p className="text-muted small mb-0 italic text-secondary">
                              Biodata belum diisi
                            </p>
                          </div>
                        )}

                        <div className="d-grid">
                          <Link
                            to={`/profiles/${user.id}`}
                            className="btn btn-outline-dark btn-sm"
                          >
                            Lihat Detail Profil
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
