# Panduan Menjalankan Aplikasi Biodata Pengawas Bawaslu

Dokumen ini berisi panduan langkah demi langkah untuk menginstal, mengonfigurasi, dan menjalankan aplikasi **Biodata Pengawas Bawaslu** di komputer lokal Anda, baik untuk sisi **Backend (Server)** maupun **Frontend (Client)**.

---

## 📋 Prasyarat Sistem

Pastikan perangkat Anda sudah terpasang perangkat lunak berikut:
1. **Node.js** (Versi 18 ke atas direkomendasikan)
2. **NPM** (Bawaan dari instalasi Node.js)
3. **PostgreSQL Database** (Versi 12 ke atas)

---

## 🗄️ Langkah 1: Persiapan Database PostgreSQL

1. Buka aplikasi database Anda (misalnya **pgAdmin** atau terminal **psql**).
2. Buat database baru bernama `employee_bio` (atau nama lain sesuai keinginan Anda).
   * Melalui SQL Shell (psql):
     ```sql
     CREATE DATABASE employee_bio;
     ```

---

## ⚙️ Langkah 2: Konfigurasi & Menjalankan Backend (Server)

1. Buka terminal/command prompt lalu masuk ke direktori **server**:
   ```bash
   cd server
   ```

2. Instal dependensi backend:
   ```bash
   npm install
   ```

3. Duplikat file konfigurasi `.env.example` menjadi `.env`:
   ```bash
   copy .env.example .env
   ```

4. Buka file `.env` di text editor (seperti VS Code), lalu sesuaikan konfigurasi database Anda:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=employee_bio
   DB_USERNAME=postgres      # Ganti dengan username PostgreSQL Anda
   DB_PASSWORD=password      # Ganti dengan password PostgreSQL Anda

   # Authentication
   JWT_SECRET=rahasia-bawaslu-super-aman

   # Server Configuration
   PORT=3000
   ```

5. Jalankan migrasi database untuk membuat tabel-tabel yang diperlukan:
   ```bash
   npx sequelize-cli db:migrate
   ```

6. Jalankan **seeders** untuk memasukkan akun Admin default:
   ```bash
   npx sequelize-cli db:seed:all
   ```

7. Jalankan server backend:
   ```bash
   npm start
   ```
   Server backend akan berjalan di **`http://localhost:3000`**.

---

## 🖥️ Langkah 3: Menjalankan Frontend (Client)

1. Buka jendela terminal baru lalu masuk ke direktori **client/employee-bio**:
   ```bash
   cd client/employee-bio
   ```

2. Instal dependensi frontend (jika belum pernah dilakukan):
   ```bash
   npm install
   ```

3. Jalankan server development React (Vite):
   ```bash
   npm run dev
   ```
   Aplikasi frontend akan berjalan di **`http://localhost:5173`**.

4. Buka browser Anda dan akses **`http://localhost:5173`**.

---

## 🔑 Informasi Akun Uji Coba (Demo Accounts)

Setelah Anda menjalankan perintah seeder (`npx sequelize-cli db:seed:all`), Anda bisa login menggunakan akun admin default berikut untuk masuk ke dashboard admin:

* **Email**: `admin@example.com`
* **Password**: `admin123`
* **Peran (Role)**: `Admin` (memiliki akses untuk melihat semua profil pengawas/karyawan, melakukan pencarian, filter, dan menghapus biodata).

*Untuk membuat akun pengawas baru, klik opsi **"Daftar" (Register)** di halaman login.*
