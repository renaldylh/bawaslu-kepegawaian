import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import { cookieHelper } from "../utils/cookieHelper";

export default function MainLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!cookieHelper.isAuthenticated()) {
      Swal.fire({
        title: "Perhatian",
        text: "Anda belum login. Silakan login terlebih dahulu.",
        icon: "error",
      });
      navigate("/login");
    }
  }, []);
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
        <div className="container">
          {/* Left Navigation */}

          <div className="navbar-nav align-items-center">
            <Link to="/" className="text-decoration-none me-4">
              <img
                src={logo}
                alt="Logo Bawaslu"
                style={{ height: "45px" }}
                className="mb-1"
              />
            </Link>

            <Link to="/" className="nav-link text-dark fw-medium me-4">
              Profil Saya
            </Link>

            <Link to="/profiles" className="nav-link text-dark fw-medium me-4">
              Daftar Pegawai
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={(e) => {
                cookieHelper.removeAccessToken();
                Swal.fire({
                  title: "Berhasil",
                  text: "Anda telah keluar dari sistem.",
                  icon: "success",
                });
                navigate("/login");
              }}
            >
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <main className="bg-light min-vh-100">
        <Outlet />
      </main>
    </>
  );
}
