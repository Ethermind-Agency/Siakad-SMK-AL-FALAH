import {
  AttendanceStatus,
  LetterType,
  LetterStatus,
  Letter,
  NewsStatus,
  FacilityCondition,
  News,
  Facility,
  SchoolProfile,
  Subject,
  ClassSubject,
} from './database';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]> | string[];
}

export interface AttendanceRecordInput {
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface SubmitAttendanceBody {
  classId: string;
  subjectId?: string; // Optional: null/undefined for daily attendance, string UUID for subject attendance
  date: string; // YYYY-MM-DD
  records: AttendanceRecordInput[];
}

export interface AttendanceSummaryStat {
  total: number;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  percentage: number;
}

export interface StudentRecapItem {
  studentId: string;
  nisn: string;
  fullName: string;
  gender: 'L' | 'P';
  stats: AttendanceSummaryStat;
}

export interface ClassAttendanceRecapResponse {
  classId: string;
  className: string;
  subjectId?: string;
  subjectName?: string;
  academicYear: string;
  period: {
    startDate?: string;
    endDate?: string;
    month?: number;
    year?: number;
  };
  totalEffectiveDays: number;
  classOverallPercentage: number;
  students: StudentRecapItem[];
}

export interface IndividualStudentRecapResponse {
  studentId: string;
  nisn: string;
  fullName: string;
  className: string;
  subjectId?: string;
  subjectName?: string;
  period: {
    startDate?: string;
    endDate?: string;
    month?: number;
    year?: number;
  };
  stats: AttendanceSummaryStat;
  records: Array<{
    date: string;
    status: AttendanceStatus;
    notes?: string | null;
  }>;
}

// Letter Interfaces
export interface CreateIncomingLetterBody {
  referenceNumber: string;
  date: string; // YYYY-MM-DD
  sender: string;
  subject: string;
  classificationCode: string;
  summary?: string;
  fileUrl?: string;
  fileSizeBytes?: number;
}

export interface CreateOutgoingLetterBody {
  date: string; // YYYY-MM-DD
  recipient: string;
  subject: string;
  classificationCode: string;
  summary?: string;
}

export interface UpdateLetterStatusBody {
  status: LetterStatus;
  dispositionNotes?: string;
}

export interface LetterFilterQuery {
  search?: string;
  classificationCode?: string;
  status?: LetterStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedLetterResponse {
  items: Letter[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// CMS Interfaces
export interface CreateNewsBody {
  title: string;
  content: string;
  excerpt?: string;
  featuredImageUrl?: string;
  status?: NewsStatus;
}

export interface UpdateNewsBody {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImageUrl?: string;
  status?: NewsStatus;
}

export interface CreateFacilityBody {
  name: string;
  description?: string;
  condition: FacilityCondition;
  imageUrl?: string;
}

export interface UpdateFacilityBody {
  name?: string;
  description?: string;
  condition?: FacilityCondition;
  imageUrl?: string;
}

export interface UpdateSchoolProfileBody {
  name?: string;
  vision?: string;
  mission?: string[];
  history?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface PaginatedNewsResponse {
  items: News[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Subject Interfaces
export interface CreateSubjectBody {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateSubjectBody {
  code?: string;
  name?: string;
  description?: string;
}

export interface AssignClassSubjectBody {
  classId: string;
  subjectId: string;
  teacherId: string;
  academicYear: string;
}
