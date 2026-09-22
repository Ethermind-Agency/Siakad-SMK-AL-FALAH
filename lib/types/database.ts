export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin_tu' | 'kepala_sekolah' | 'guru' | 'siswa_ortu';
export type AttendanceStatus = 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';

export type LetterType = 'incoming' | 'outgoing';
export type LetterStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

export type NewsStatus = 'draft' | 'published' | 'archived';
export type FacilityCondition = 'baik' | 'rusak_ringan' | 'rusak_sedang' | 'rusak_berat';

export interface Profile {
  id: string; // references auth.users
  email: string;
  full_name: string;
  role: UserRole;
  nip_or_nisn?: string | null;
  phone?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassItem {
  id: string;
  name: string; // e.g., "X TKJ 1", "XI TBSM"
  grade_level: number; // 10, 11, 12
  academic_year: string; // e.g., "2026/2027"
  homeroom_teacher_id: string; // references profiles.id
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  code: string; // e.g. "AIJ", "MTK", "B-IND"
  name: string; // e.g. "Administrasi Infrastruktur Jaringan"
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassSubject {
  id: string;
  class_id: string; // references classes.id
  subject_id: string; // references subjects.id
  teacher_id: string; // references profiles.id (subject teacher)
  academic_year: string; // e.g. "2026/2027"
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  nisn: string;
  full_name: string;
  class_id: string; // references classes.id
  parent_user_id?: string | null; // references profiles.id
  gender: 'L' | 'P';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  class_id: string; // references classes.id
  subject_id?: string | null; // references subjects.id (null = daily attendance by homeroom teacher)
  date: string; // format: YYYY-MM-DD
  recorded_by: string; // references profiles.id
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  attendance_id: string; // references attendances.id
  student_id: string; // references students.id
  status: AttendanceStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Letter {
  id: string;
  type: LetterType;
  reference_number: string;
  date: string;
  sender_or_recipient: string;
  subject: string;
  classification_code: string;
  summary?: string | null;
  file_url?: string | null;
  file_size_bytes?: number | null;
  status: LetterStatus;
  disposition_notes?: string | null;
  disposition_by?: string | null;
  sequence_number?: number | null;
  year: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface LetterStatusHistory {
  id: string;
  letter_id: string;
  from_status?: LetterStatus | null;
  to_status: LetterStatus;
  changed_by: string;
  notes?: string | null;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  status: NewsStatus;
  published_at?: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface Facility {
  id: string;
  name: string;
  description?: string | null;
  condition: FacilityCondition;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SchoolProfile {
  id: string;
  name: string;
  npsn: string;
  vision: string;
  mission: string[];
  history: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: Json;
  ip_address?: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: UserRole;
          nip_or_nisn?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: UserRole;
          nip_or_nisn?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      classes: {
        Row: ClassItem;
        Insert: {
          id?: string;
          name: string;
          grade_level: number;
          academic_year: string;
          homeroom_teacher_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          grade_level?: number;
          academic_year?: string;
          homeroom_teacher_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'classes_homeroom_teacher_id_fkey';
            columns: ['homeroom_teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      subjects: {
        Row: Subject;
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      class_subjects: {
        Row: ClassSubject;
        Insert: {
          id?: string;
          class_id: string;
          subject_id: string;
          teacher_id: string;
          academic_year: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          subject_id?: string;
          teacher_id?: string;
          academic_year?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'class_subjects_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'class_subjects_subject_id_fkey';
            columns: ['subject_id'];
            isOneToOne: false;
            referencedRelation: 'subjects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'class_subjects_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      students: {
        Row: Student;
        Insert: {
          id?: string;
          nisn: string;
          full_name: string;
          class_id: string;
          parent_user_id?: string | null;
          gender: 'L' | 'P';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nisn?: string;
          full_name?: string;
          class_id?: string;
          parent_user_id?: string | null;
          gender?: 'L' | 'P';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'students_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'students_parent_user_id_fkey';
            columns: ['parent_user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      attendances: {
        Row: Attendance;
        Insert: {
          id?: string;
          class_id: string;
          subject_id?: string | null;
          date: string;
          recorded_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          subject_id?: string | null;
          date?: string;
          recorded_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attendances_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendances_subject_id_fkey';
            columns: ['subject_id'];
            isOneToOne: false;
            referencedRelation: 'subjects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendances_recorded_by_fkey';
            columns: ['recorded_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      attendance_records: {
        Row: AttendanceRecord;
        Insert: {
          id?: string;
          attendance_id: string;
          student_id: string;
          status: AttendanceStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          attendance_id?: string;
          student_id?: string;
          status?: AttendanceStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attendance_records_attendance_id_fkey';
            columns: ['attendance_id'];
            isOneToOne: false;
            referencedRelation: 'attendances';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendance_records_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      letters: {
        Row: Letter;
        Insert: {
          id?: string;
          type: LetterType;
          reference_number: string;
          date: string;
          sender_or_recipient: string;
          subject: string;
          classification_code: string;
          summary?: string | null;
          file_url?: string | null;
          file_size_bytes?: number | null;
          status?: LetterStatus;
          disposition_notes?: string | null;
          disposition_by?: string | null;
          sequence_number?: number | null;
          year: number;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: LetterType;
          reference_number?: string;
          date?: string;
          sender_or_recipient?: string;
          subject?: string;
          classification_code?: string;
          summary?: string | null;
          file_url?: string | null;
          file_size_bytes?: number | null;
          status?: LetterStatus;
          disposition_notes?: string | null;
          disposition_by?: string | null;
          sequence_number?: number | null;
          year?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'letters_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'letters_disposition_by_fkey';
            columns: ['disposition_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      letter_status_histories: {
        Row: LetterStatusHistory;
        Insert: {
          id?: string;
          letter_id: string;
          from_status?: LetterStatus | null;
          to_status: LetterStatus;
          changed_by: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          letter_id?: string;
          from_status?: LetterStatus | null;
          to_status?: LetterStatus;
          changed_by?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'letter_status_histories_letter_id_fkey';
            columns: ['letter_id'];
            isOneToOne: false;
            referencedRelation: 'letters';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'letter_status_histories_changed_by_fkey';
            columns: ['changed_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      news: {
        Row: News;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          featured_image_url?: string | null;
          status?: NewsStatus;
          published_at?: string | null;
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          featured_image_url?: string | null;
          status?: NewsStatus;
          published_at?: string | null;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'news_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      facilities: {
        Row: Facility;
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          condition: FacilityCondition;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          condition?: FacilityCondition;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      school_profile: {
        Row: SchoolProfile;
        Insert: {
          id?: string;
          name: string;
          npsn: string;
          vision: string;
          mission: string[];
          history: string;
          address: string;
          phone?: string | null;
          email?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          npsn?: string;
          vision?: string;
          mission?: string[];
          history?: string;
          address?: string;
          phone?: string | null;
          email?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          details: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          details?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'activity_logs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      attendance_status: AttendanceStatus;
      letter_type: LetterType;
      letter_status: LetterStatus;
      news_status: NewsStatus;
      facility_condition: FacilityCondition;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
