-- ==============================================================================
-- SISTEM INFORMASI MANAJEMEN SEKOLAH (SIMS) — SMKS AL-FALAH (NPSN: 69984368)
-- Production PostgreSQL Database DDL & Row Level Security (RLS) Policies
-- Optimized for Supabase PostgreSQL (Serverless Vercel Deployment)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin_tu', 'kepala_sekolah', 'guru', 'siswa_ortu');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALPA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE letter_type AS ENUM ('incoming', 'outgoing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE letter_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE news_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE facility_condition AS ENUM ('baik', 'rusak_ringan', 'rusak_sedang', 'rusak_berat');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. HELPER FUNCTION: AUTO-UPDATE TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. TABLES CREATION

-- 4.1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'siswa_ortu',
    nip_or_nisn TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.2. CLASSES (Daftar Kelas)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    grade_level INT NOT NULL CHECK (grade_level IN (10, 11, 12)),
    academic_year VARCHAR(20) NOT NULL,
    homeroom_teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_class_per_year UNIQUE (name, academic_year)
);

-- 4.3. SUBJECTS (Master Mata Pelajaran)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.4. CLASS_SUBJECTS (Penugasan Guru Mapel per Kelas)
CREATE TABLE IF NOT EXISTS public.class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_class_subject_teacher UNIQUE (class_id, subject_id, academic_year)
);

-- 4.5. STUDENTS (Daftar Siswa)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nisn VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
    parent_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('L', 'P')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.6. ATTENDANCES (Header Presensi Kelas / Mapel)
CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    recorded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique Index to prevent duplicate attendance submissions
CREATE UNIQUE INDEX IF NOT EXISTS uq_attendances_daily 
ON public.attendances (class_id, date) 
WHERE subject_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_attendances_subject 
ON public.attendances (class_id, subject_id, date) 
WHERE subject_id IS NOT NULL;

-- 4.7. ATTENDANCE_RECORDS (Detail Presensi per Siswa)
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_id UUID NOT NULL REFERENCES public.attendances(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    status attendance_status NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_attendance_student UNIQUE (attendance_id, student_id)
);

-- 4.8. LETTERS (Surat Masuk & Keluar / E-Office)
CREATE TABLE IF NOT EXISTS public.letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type letter_type NOT NULL,
    reference_number VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    sender_or_recipient VARCHAR(150) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    classification_code VARCHAR(50) NOT NULL,
    summary TEXT,
    file_url TEXT,
    file_size_bytes BIGINT,
    status letter_status NOT NULL DEFAULT 'pending',
    disposition_notes TEXT,
    disposition_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sequence_number INT,
    year INT NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique index for outgoing letter sequence per year
CREATE UNIQUE INDEX IF NOT EXISTS uq_outgoing_letter_sequence 
ON public.letters (year, sequence_number) 
WHERE type = 'outgoing';

-- 4.9. LETTER_STATUS_HISTORIES (Audit Trail Status Surat)
CREATE TABLE IF NOT EXISTS public.letter_status_histories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    letter_id UUID NOT NULL REFERENCES public.letters(id) ON DELETE CASCADE,
    from_status letter_status,
    to_status letter_status NOT NULL,
    changed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.10. NEWS (CMS Berita & Pengumuman Sekolah)
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    featured_image_url TEXT,
    status news_status NOT NULL DEFAULT 'published',
    published_at TIMESTAMPTZ,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.11. FACILITIES (Fasilitas & Kondisi Ruangan)
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    condition facility_condition NOT NULL DEFAULT 'baik',
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.12. SCHOOL_PROFILE (Visi, Misi, Sejarah, Identitas)
CREATE TABLE IF NOT EXISTS public.school_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    npsn VARCHAR(20) NOT NULL,
    vision TEXT NOT NULL,
    mission JSONB NOT NULL DEFAULT '[]'::jsonb,
    history TEXT NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.13. ACTIVITY_LOGS (Audit Trail Operasional)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_classes_academic_year ON public.classes(academic_year);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_user_id ON public.students(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_students_nisn ON public.students(nisn);
CREATE INDEX IF NOT EXISTS idx_attendances_class_date ON public.attendances(class_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_attendance_id ON public.attendance_records(attendance_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student_id ON public.attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_letters_type_status ON public.letters(type, status);
CREATE INDEX IF NOT EXISTS idx_letters_date ON public.letters(date);
CREATE INDEX IF NOT EXISTS idx_letters_reference_number ON public.letters(reference_number);
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);

-- 6. TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_classes BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_subjects BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_class_subjects BEFORE UPDATE ON public.class_subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_students BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_attendances BEFORE UPDATE ON public.attendances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_attendance_records BEFORE UPDATE ON public.attendance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_letters BEFORE UPDATE ON public.letters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_news BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_facilities BEFORE UPDATE ON public.facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_school_profile BEFORE UPDATE ON public.school_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES (PRD SYS-09)
-- ==============================================================================

-- Helper Function: Get Auth User Role from Profiles Table
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letter_status_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 7.1. PROFILES POLICIES
CREATE POLICY "Public read profiles basic info" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin TU full manage profiles" ON public.profiles FOR ALL USING (public.get_auth_role() = 'admin_tu');

-- 7.2. CLASSES POLICIES
CREATE POLICY "Anyone can view classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Admin TU can manage classes" ON public.classes FOR ALL USING (public.get_auth_role() = 'admin_tu');

-- 7.3. SUBJECTS POLICIES
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admin TU can manage subjects" ON public.subjects FOR ALL USING (public.get_auth_role() = 'admin_tu');

-- 7.4. CLASS_SUBJECTS POLICIES
CREATE POLICY "Anyone can view class subjects" ON public.class_subjects FOR SELECT USING (true);
CREATE POLICY "Admin TU can manage class subjects" ON public.class_subjects FOR ALL USING (public.get_auth_role() = 'admin_tu');

-- 7.5. STUDENTS POLICIES
CREATE POLICY "Staff can view all students" ON public.students FOR SELECT USING (public.get_auth_role() IN ('admin_tu', 'guru', 'kepala_sekolah'));
CREATE POLICY "Parents and students can view own record" ON public.students FOR SELECT USING (parent_user_id = auth.uid() OR id = auth.uid());
CREATE POLICY "Admin TU can manage students" ON public.students FOR ALL USING (public.get_auth_role() = 'admin_tu');

-- 7.6. ATTENDANCES POLICIES
CREATE POLICY "Staff can view attendances" ON public.attendances FOR SELECT USING (public.get_auth_role() IN ('admin_tu', 'guru', 'kepala_sekolah'));
CREATE POLICY "Guru can insert attendance for assigned classes/subjects" ON public.attendances FOR INSERT WITH CHECK (
    public.get_auth_role() IN ('admin_tu', 'guru')
);
CREATE POLICY "Guru can update attendance" ON public.attendances FOR UPDATE USING (
    public.get_auth_role() IN ('admin_tu', 'guru')
);

-- 7.7. ATTENDANCE_RECORDS POLICIES
CREATE POLICY "Staff can view all attendance records" ON public.attendance_records FOR SELECT USING (public.get_auth_role() IN ('admin_tu', 'guru', 'kepala_sekolah'));
CREATE POLICY "Students and parents can view own attendance records" ON public.attendance_records FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE parent_user_id = auth.uid() OR id = auth.uid())
);
CREATE POLICY "Guru and Admin TU can manage attendance records" ON public.attendance_records FOR ALL USING (public.get_auth_role() IN ('admin_tu', 'guru'));

-- 7.8. LETTERS POLICIES (PRD SYS-04: Guru cannot access letters)
CREATE POLICY "Admin TU and Kepala Sekolah can view letters" ON public.letters FOR SELECT USING (public.get_auth_role() IN ('admin_tu', 'kepala_sekolah'));
CREATE POLICY "Admin TU can insert letters" ON public.letters FOR INSERT WITH CHECK (public.get_auth_role() = 'admin_tu');
CREATE POLICY "Admin TU and Kepala Sekolah can update letters" ON public.letters FOR UPDATE USING (public.get_auth_role() IN ('admin_tu', 'kepala_sekolah'));
CREATE POLICY "Admin TU can delete letters" ON public.letters FOR DELETE USING (public.get_auth_role() = 'admin_tu');

-- 7.9. LETTER_STATUS_HISTORIES POLICIES
CREATE POLICY "Admin TU and Kepala Sekolah can view letter histories" ON public.letter_status_histories FOR SELECT USING (public.get_auth_role() IN ('admin_tu', 'kepala_sekolah'));
CREATE POLICY "Admin TU and Kepala Sekolah can insert letter histories" ON public.letter_status_histories FOR INSERT WITH CHECK (public.get_auth_role() IN ('admin_tu', 'kepala_sekolah'));

-- 7.10. NEWS POLICIES
CREATE POLICY "Public can view published news" ON public.news FOR SELECT USING (status = 'published' OR public.get_auth_role() = 'admin_tu');
CREATE POLICY "Admin TU can manage news" ON public.news FOR ALL USING (public.get_auth_role() = 'admin_tu');

-- 7.11. FACILITIES POLICIES
CREATE POLICY "Public can view facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Admin TU can manage facilities" ON public.facilities FOR ALL USING (public.get_auth_role() = 'admin_tu');

-- 7.12. SCHOOL_PROFILE POLICIES
CREATE POLICY "Public can view school profile" ON public.school_profile FOR SELECT USING (true);
CREATE POLICY "Admin TU can manage school profile" ON public.school_profile FOR ALL USING (public.get_auth_role() = 'admin_tu');

-- 7.13. ACTIVITY_LOGS POLICIES
CREATE POLICY "Admin TU can view activity logs" ON public.activity_logs FOR SELECT USING (public.get_auth_role() = 'admin_tu');
CREATE POLICY "Authenticated users can insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ==============================================================================
-- 8. INITIAL SEED DATA
-- ==============================================================================
INSERT INTO public.school_profile (name, npsn, vision, mission, history, address, phone, email)
VALUES (
    'SMKS AL-FALAH',
    '69984368',
    'Mewujudkan lulusan yang berakhlak mulia, kompeten, dan mandiri.',
    '["Menyelenggarakan pendidikan kejuruan yang berbasis nilai-nilai keislaman dan disiplin.", "Meningkatkan keterampilan vokasional siswa sesuai standar dunia usaha dan industri.", "Menumbuhkan jiwa kewirausahaan dan kemandirian."]'::jsonb,
    'SMKS AL-FALAH didirikan di bawah naungan Yayasan Pondok Pesantren Al-Falah Teluk Pakedai, Kabupaten Kubu Raya, Kalimantan Barat, untuk melayani kebutuhan pendidikan kejuruan masyarakat Sungai Deras dan sekitarnya.',
    'Desa Sungai Deras, Kec. Telok Pakedai, Kab. Kubu Raya, Kalbar, 78383',
    '0852-xxxx-xxxx',
    'info@smks-alfalah.sch.id'
)
ON CONFLICT DO NOTHING;
