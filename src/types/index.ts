
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'Preceptor'; // Only one role for now
}

export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
}

export type Subject = string;

export interface Course {
  id: string;
  name: string;
  teacherIds: string[]; // IDs of teachers assigned to this course
}

export interface Shift {
  id: string;
  name: 'Mañana' | 'Tarde' | 'Noche';
}

export type AttendanceStatus = 'Presente' | 'Ausente' | 'Llegó Tarde' | 'Justificado';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  shiftId: string;
  courseId: string;
  teacherId: string;
  subject: string; // The specific subject for this attendance entry
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceFormData extends Omit<AttendanceRecord, 'id' | 'date' | 'shiftId' | 'courseId'> {
  // Used in the form, date, shift, course are handled separately
}

export interface ReportSummary {
  teacherId: string;
  teacherName: string;
  presente: number;
  ausente: number;
  llegóTarde: number;
  justificado: number;
}
