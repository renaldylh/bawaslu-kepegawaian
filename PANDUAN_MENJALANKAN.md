# Panduan Menjalankan Aplikasi Biodata Pengawas Bawaslu

Dokumen ini berisi panduan langkah demi langkah untuk menginstal, mengonfigurasi, dan menjalankan aplikasi **Biodata Pengawas Bawaslu** di komputer lokal Anda. Aplikasi ini mendukung **SQLite** (tanpa perlu install database server) dan **PostgreSQL** (untuk skala production/server).

---

## 📋 Prasyarat Sistem

Pastikan perangkat Anda sudah terpasang perangkat lunak berikut:
1. **Node.js** (Versi 18 ke atas direkomendasikan)
2. **NPM** (Bawaan dari instalasi Node.js)
3. *Opsional*: **PostgreSQL** (Jika ingin menggunakan database PostgreSQL)

---

## ⚙️ Langkah 1: Konfigurasi & Menjalankan Backend (Server)

1. Buka terminal/command prompt lalu masuk ke direktori **server**:
   ```bash
   cd server
   ```

2. Instal dependensi backend:
   ```bash
   npm install
   ```

3. Duplikat file konfigurasi `.env.example` menjadi `.env` (atau edit file `.env` yang sudah ada):
   * Di Windows Command Prompt:
     ```cmd
     copy .env.example .env
     ```
   * Di Linux/macOS atau Git Bash:
     ```bash
     cp .env.example .env
     ```

4. Buka file `.env` di text editor (seperti VS Code), lalu pilih jenis database yang ingin digunakan:

   ### PILIHAN A: Menggunakan SQLite (Rekomendasi - Paling Mudah & Cepat)
   *Anda tidak perlu menginstal database server apapun. Database akan disimpan dalam satu file otomatis.*
   ```env
   DB_DIALECT=sqlite
   DB_STORAGE=./database.sqlite
   ```

   ### PILIHAN B: Menggunakan PostgreSQL (Untuk Production / Server)
   *Pastikan database server PostgreSQL Anda aktif.*
   ```env
   DB_DIALECT=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=employee_bio
   DB_USERNAME=postgres      # Ganti dengan username PostgreSQL Anda
   DB_PASSWORD=password      # Ganti dengan password PostgreSQL Anda
   ```

5. Jalankan migrasi database untuk membuat tabel-tabel secara otomatis:
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

## 🖥️ Langkah 2: Menjalankan Frontend (Client)

1. Buka jendela terminal baru lalu masuk ke direktori **client/employee-bio**:
   ```bash
   cd client/employee-bio
   ```

2. Instal dependensi frontend:
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
