import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import { cookieHelper } from "../utils/cookieHelper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_API_URL || "http://localhost:3030"}/login`,
        data: {
          email,
          password,
        },
      });
      console.log(response, "<<===postLogin");

      // Store token in secure cookie instead of localStorage
      cookieHelper.setAccessToken(response.data.access_token);

      Swal.fire({
        title: "Berhasil",
        text: "Login berhasil!",
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
    <div className="min-vh-100 d-flex align-items-center bawaslu-login-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="text-center mb-4">
              <img
                src={logo}
                alt="Logo Bawaslu"
                className="mb-4"
                style={{ height: "65px" }}
              />
              <h1 className="h3 text-white mb-0">Selamat Datang Kembali</h1>
              <p className="text-white-50 mt-2">Masuk ke Sistem Informasi Biodata Bawaslu</p>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={submitHandle}>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="form-label text-dark mb-2"
                    >
                      Alamat Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control py-3 border-1"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label text-dark mb-2"
                    >
                      Kata Sandi
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control py-3 border-1"
                      placeholder="Masukkan kata sandi Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100 py-3 mb-4"
                  >
                    Masuk
                  </button>

                  <p className="text-center text-muted mb-0">
                    Belum punya akun?{" "}
                    <Link
                      to="/register"
                      className="text-dark text-decoration-none fw-medium"
                    >
                      Daftar Sekarang
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
