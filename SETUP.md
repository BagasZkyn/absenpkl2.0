# Setup Supabase untuk Absen PKL

## 1. Buat Project Supabase

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Klik "New Project"
3. Beri nama project (contoh: `absen-pkl`)
4. Pilih database password yang kuat dan ingat password tersebut
5. Klik "Create new project"

## 2. Setup Authentication

1. Setelah project terbuat, masuk ke menu "Authentication"
2. Pilih tab "Providers"
3. Aktifkan "Email" provider
4. Scroll ke bawah dan klik "Save"

## 3. Buat Tabel User Profiles

1. Masuk ke menu "Table Editor"
2. Klik "Create a new table"
3. Isi konfigurasi tabel:
   - **Name**: `user_profiles`
   - **Enable Row Level Security (RLS)**: ON
4. Tambahkan columns:

   | Name | Type | Default | Nullable | Unique |
   |------|------|---------|----------|---------|
   | id | uuid | uuid_generate_v4() | NO | YES |
   | email | text | | NO | YES |
   | name | text | | YES | NO |
   | nis | text | | YES | NO |
   | class | text | | YES | NO |
   | phone | text | | YES | NO |
   | school | text | | YES | NO |
   | major | text | | YES | NO |
   | internship_company | text | | YES | NO |
   | internship_position | text | | YES | NO |
   | internship_duration | text | | YES | NO |
   | created_at | timestamp | now() | NO | NO |
   | updated_at | timestamp | now() | NO | NO |

5. Klik "Save" untuk membuat tabel

## 4. Setup RLS (Row Level Security)

1. Pada tabel `user_profiles`, klik "Authentication" tab
2. Klik "Create Policy"
3. Buat policy untuk INSERT:

   ```sql
   CREATE POLICY "Users can insert their own profile"
   ON user_profiles
   FOR INSERT WITH CHECK (auth.uid() = id);
   ```

4. Buat policy untuk SELECT:

   ```sql
   CREATE POLICY "Users can view their own profile"
   ON user_profiles
   FOR SELECT USING (auth.uid() = id);
   ```

5. Buat policy untuk UPDATE:

   ```sql
   CREATE POLICY "Users can update their own profile"
   ON user_profiles
   FOR UPDATE USING (auth.uid() = id);
   ```

## 5. Tambahkan User Manual

1. Masuk ke menu "Authentication"
2. Pilih tab "Users"
3. Klik "Add user"
4. Tambahkan user untuk demo:

   **User Admin:**
   - Email: `admin@sekolah.sch.id`
   - Password: `admin123`

   **User Siswa:**
   - Email: `siswa@sekolah.sch.id`
   - Password: `siswa123`

5. Setelah user dibuat, masuk ke tabel `user_profiles` dan tambahkan data profile untuk masing-masing user:

   **Untuk Admin:**
   ```sql
   INSERT INTO user_profiles (id, email, name, nis, class, phone, school, major, internship_company, internship_position, internship_duration)
   VALUES (
     'USER_ID_ADMIN', -- Ganti dengan actual user ID dari auth.users
     'admin@sekolah.sch.id',
     'Admin System',
     'ADMIN001',
     'Admin',
     '+62 812-3456-7890',
     'SMK Negeri 1 Jakarta',
     'Sistem Informasi',
     'PT. Teknologi Maju Bersama',
     'System Administrator',
     'Januari 2024 - Desember 2024'
   );
   ```

   **Untuk Siswa:**
   ```sql
   INSERT INTO user_profiles (id, email, name, nis, class, phone, school, major, internship_company, internship_position, internship_duration)
   VALUES (
     'USER_ID_SISWA', -- Ganti dengan actual user ID dari auth.users
     'siswa@sekolah.sch.id',
     'Ahmad Rizki Pratama',
     '202100123',
     'XII RPL 1',
     '+62 812-3456-7890',
     'SMK Negeri 1 Jakarta',
     'Rekayasa Perangkat Lunak',
     'PT. Teknologi Maju Bersama',
     'Junior Web Developer',
     'Agustus 2024 - Januari 2025'
   );
   ```

## 6. Konfigurasi Environment Variables

1. Dapatkan Supabase URL dan Anon Key:
   - Masuk ke menu "Project Settings"
   - Pilih "API"
   - Copy "Project URL" dan "anon public key"

2. Update file `.env.local` di root project:

   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 7. Jalankan Aplikasi

1. Install dependencies:
   ```bash
   npm install
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Akses aplikasi di `http://localhost:3000`

## 8. Testing Login

1. Buka halaman login: `http://localhost:3000/login`
2. Gunakan kredensial demo:
   - Admin: `admin@sekolah.sch.id` / `admin123`
   - Siswa: `siswa@sekolah.sch.id` / `siswa123`

3. Test fitur auto-login dengan refresh halaman setelah login

## 9. Deploy ke Vercel

1. Push kode ke GitHub repository
2. Connect repository ke Vercel
3. Tambahkan environment variables di Vercel:
   - `NEXT_PUBLIC_SUPabase_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy aplikasi

## Troubleshooting

### Jika login gagal:
- Pastikan user sudah dibuat di Supabase Authentication
- Pastikan user profile sudah ada di tabel `user_profiles`
- Cek console browser untuk error messages

### Jika RLS policy error:
- Pastikan RLS policies sudah di-setup dengan benar
- Cek apakah user ID di auth.users sama dengan di user_profiles

### Jika environment variables tidak terbaca:
- Pastikan file `.env.local` sudah diisi dengan benar
- Restart development server setelah mengubah environment variables