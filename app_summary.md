
# Dokumentasi Aplikasi UniSphere

## 1. Masalah yang Diselesaikan

UniSphere adalah aplikasi web komprehensif yang dirancang untuk lingkungan universitas. Aplikasi ini bertujuan untuk mengatasi beberapa tantangan utama yang dihadapi mahasiswa dengan menyediakan platform terpusat untuk:

- **Dukungan Kesehatan Mental:** Memberikan akses mudah ke chatbot AI sebagai teman curhat pertama untuk membantu mahasiswa mengelola stres, kecemasan, dan masalah kesehatan mental lainnya.
- **Manajemen Keluhan:** Menyediakan sistem yang terstruktur bagi mahasiswa untuk mengajukan keluhan terkait fasilitas, akademik, atau masalah lainnya, dan memungkinkan admin untuk melacak serta menindaklanjuti keluhan tersebut secara efisien.
- **Pembangunan Komunitas:** Menciptakan ruang bagi mahasiswa untuk berdiskusi, berbagi ide, dan membangun komunitas melalui forum online yang aman dan moderat.
- **Keterlibatan Mahasiswa:** Meningkatkan keterlibatan dan rasa memiliki mahasiswa terhadap universitas dengan menyediakan platform yang mendengarkan dan merespons kebutuhan mereka.

## 2. Fitur-Fitur Utama

Aplikasi ini dilengkapi dengan berbagai fitur yang dirancang untuk memenuhi kebutuhan pengguna:

- **Autentikasi Pengguna:**
  - Sistem login dan registrasi yang aman.
  - Pengguna dapat melihat dan mengelola profil mereka, termasuk mengganti avatar.

- **Chatbot AI (Sahabat Mental):**
  - Didukung oleh Google Generative AI (Gemini).
  - Memberikan respons yang empatik dan suportif terhadap curhatan pengguna.
  - Dapat diakses 24/7 sebagai pertolongan pertama pada masalah kesehatan mental.

- **Forum Diskusi:**
  - Pengguna dapat membuat postingan baru di forum.
  - Pengguna dapat melihat daftar semua postingan dari pengguna lain.
  - Pengguna dapat memberikan komentar pada setiap postingan untuk berdiskusi.

- **Sistem Manajemen Keluhan:**
  - Formulir untuk mengajukan keluhan baru dengan deskripsi dan kategori.
  - Pengguna dapat melihat riwayat keluhan yang telah mereka ajukan.
  - Status keluhan yang transparan (misalnya, "Pending", "In Progress", "Resolved").

- **Dashboard Admin:**
  - Halaman khusus untuk admin mengelola aplikasi.
  - Menampilkan statistik penting dalam bentuk grafik (misalnya, jumlah keluhan berdasarkan status atau kategori) menggunakan Recharts.
  - Daftar semua keluhan dari pengguna yang memungkinkan admin untuk mengubah statusnya.

- **Antarmuka Pengguna yang Responsif:**
  - Desain modern dan mudah digunakan yang dioptimalkan untuk berbagai perangkat.
  - Menggunakan ikon dari `lucide-react` dan notifikasi dari `react-hot-toast` untuk pengalaman pengguna yang lebih baik.

## 3. Library dan Teknologi yang Digunakan

UniSphere dibangun menggunakan teknologi modern untuk memastikan skalabilitas, keamanan, dan kemudahan pengembangan.

| Library/Teknologi        | Versi      | Fungsi Utama                                                                                             |
| ------------------------ | ---------- | -------------------------------------------------------------------------------------------------------- |
| **React**                | `^19.1.1`  | Library utama untuk membangun antarmuka pengguna (UI) yang interaktif dan berbasis komponen.             |
| **Vite**                 | `^7.1.7`   | Build tool modern yang menyediakan server pengembangan super cepat dan proses build yang dioptimalkan.     |
| **React Router DOM**     | `^7.9.4`   | Mengelola navigasi dan routing di dalam aplikasi, memungkinkan perpindahan antar halaman tanpa reload.    |
| **Supabase JS**          | `^2.76.1`  | Bertindak sebagai backend (Backend-as-a-Service), menyediakan database, autentikasi, dan storage.        |
| **Google Generative AI** | `^0.24.1`  | Mengintegrasikan model AI generatif dari Google (Gemini) untuk fitur chatbot.                            |
| **Recharts**             | `^3.3.0`   | Library untuk membuat grafik dan chart yang interaktif, digunakan di dashboard admin.                    |
| **Lucide React**         | `^0.546.0` | Menyediakan koleksi ikon SVG yang ringan dan konsisten untuk mempercantik antarmuka.                     |
| **React Hot Toast**      | `^2.6.0`   | Menampilkan notifikasi (toast) yang elegan untuk memberikan umpan balik kepada pengguna.                 |
| **Tailwind CSS**         | `^4.1.16`  | Framework CSS utility-first untuk membangun desain kustom dengan cepat tanpa meninggalkan HTML.          |
| **ESLint**               | `^9.36.0`  | Alat untuk analisis kode statis (linting) yang membantu menemukan dan memperbaiki masalah dalam kode.    |

## 4. Rute Pengguna (Alur Aplikasi)

Navigasi aplikasi diatur sebagai berikut, dengan beberapa rute yang memerlukan autentikasi.

| Path           | Komponen/Halaman        | Deskripsi                                                                    | Memerlukan Login |
| -------------- | ----------------------- | ---------------------------------------------------------------------------- | ---------------- |
| `/`            | `Home`                  | Halaman utama atau landing page aplikasi.                                    | Tidak            |
| `/login`       | `Login`                 | Halaman untuk pengguna masuk atau mendaftar.                                 | Tidak            |
| `/profile`     | `Profile`               | Halaman di mana pengguna dapat melihat dan mengelola profil mereka.          | Ya               |
| `/chat`        | `ChatPage`              | Halaman untuk berinteraksi dengan chatbot AI.                                | Ya               |
| `/forum`       | `ForumPage`             | Halaman yang menampilkan daftar postingan forum dan memungkinkan diskusi.    | Tidak            |
| `/complaints`  | `ComplaintPage`         | Halaman untuk mengajukan keluhan baru dan melihat riwayat keluhan pribadi.   | Ya               |
| `/admin`       | `AdminPage`             | Dashboard khusus untuk admin mengelola keluhan dan melihat statistik.        | Ya (Admin)       |

## 5. Struktur File Proyek

Struktur direktori proyek diatur untuk memisahkan setiap bagian dari aplikasi secara logis, membuatnya lebih mudah untuk dikelola dan dikembangkan.

```
C:/App_UniSphere/
├── public/              # Aset statis seperti ikon utama
├── src/
│   ├── assets/          # Aset seperti gambar, avatar, dll.
│   ├── components/      # Komponen UI yang dapat digunakan kembali
│   │   ├── Auth/        # Komponen terkait autentikasi (Login, Profile)
│   │   ├── ChatBot/     # Komponen untuk fitur chatbot
│   │   ├── common/      # Komponen umum (Navbar, ErrorBoundary)
│   │   ├── Complaint/   # Komponen terkait sistem keluhan
│   │   ├── Dashboard/   # Komponen untuk dashboard admin (termasuk Charts)
│   │   └── Forum/       # Komponen untuk forum (Post, Comment)
│   ├── hooks/           # Custom hooks untuk mengelola state dan logika (misal: useAuth, useComplaints)
│   ├── pages/           # Komponen utama yang mewakili satu halaman/rute
│   │   ├── Admin/
│   │   ├── Chat/
│   │   ├── Complaint/
│   │   ├── Forum/
│   │   └── Home/
│   ├── utils/           # Fungsi utilitas dan konfigurasi helper
│   │   ├── geminiAI.js  # Konfigurasi dan interaksi dengan Gemini AI
│   │   ├── supabase.js  # Konfigurasi koneksi ke Supabase
│   │   └── ...
│   ├── App.jsx          # Komponen root aplikasi yang mengatur routing
│   ├── main.jsx         # Titik masuk utama aplikasi React
│   └── index.css        # File CSS global
├── .env.example         # Contoh file variabel lingkungan
├── package.json         # Daftar dependensi dan skrip proyek
└── vite.config.js       # File konfigurasi untuk Vite
```
