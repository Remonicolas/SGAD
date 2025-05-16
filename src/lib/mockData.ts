
import type { Teacher, Course, Shift, AttendanceRecord, AttendanceStatus } from '@/types';

export const TEACHERS_LIST: Teacher[] = [
  { id: 't1', name: 'Prof. María González', subjects: ['Análisis de Sistemas'] },
  { id: 't2', name: 'Prof. Benjamin Assereto', subjects: ['Programación I'] },
  { id: 't3', name: 'Prof. Marcelo Fabián Tischelman', subjects: ['Taller de Comunicación'] },
  { id: 't4', name: 'Prof. Carlos Díaz', subjects: ['Redes de Computadoras'] },
  { id: 't5', name: 'Prof. Lucía Fernández', subjects: ['Matemática Discreta'] },
  { id: 't6', name: 'Prof. Diego Ramírez', subjects: ['Ingeniería de Sistemas'] },
  { id: 't7', name: 'Prof. Sofía Herrera', subjects: ['Gestión de Proyectos'] },
  { id: 't8', name: 'Prof. Ana Paredes', subjects: ['Base de Datos'] },
  { id: 't9', name: 'Prof. Jorge Luna', subjects: ['Arquitectura de Computadoras'] },
];

export const ALL_SUBJECTS: string[] = [
  'Análisis de Sistemas',
  'Ingeniería de Sistemas',
  'Taller de Comunicación',
  'Programación I',
  'Base de Datos',
  'Arquitectura de Computadoras',
  'Matemática Discreta',
  'Redes de Computadoras',
  'Gestión de Proyectos',
];

export const COURSES_LIST: Course[] = [
  { id: 'c1', name: '1° Año A', teacherIds: ['t1', 't2', 't5'] },
  { id: 'c2', name: '1° Año B', teacherIds: ['t3', 't4', 't8'] },
  { id: 'c3', name: '2° Año A', teacherIds: ['t6', 't7', 't9'] },
  { id: 'c4', name: '2° Año B', teacherIds: ['t1', 't4', 't7'] },
];

export const SHIFTS_LIST: Shift[] = [
  { id: 's1', name: 'Mañana' },
  { id: 's2', name: 'Tarde' },
  { id: 's3', name: 'Noche' },
];

export const ATTENDANCE_STATUS_OPTIONS: AttendanceStatus[] = [
  'Presente', 'Ausente', 'Llegó Tarde', 'Justificado'
];

export const MOCK_INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'ar1',
    date: '2024-07-28',
    shiftId: 's1',
    courseId: 'c1',
    teacherId: 't1',
    subject: 'Análisis de Sistemas',
    status: 'Presente',
    notes: 'Clase iniciada puntualmente.',
  },
  {
    id: 'ar2',
    date: '2024-07-28',
    shiftId: 's1',
    courseId: 'c1',
    teacherId: 't2',
    subject: 'Programación I',
    status: 'Ausente',
    notes: 'Avisó con anticipación.',
  },
  {
    id: 'ar3',
    date: '2024-07-28',
    shiftId: 's1',
    courseId: 'c1',
    teacherId: 't5',
    subject: 'Matemática Discreta',
    status: 'Llegó Tarde',
    notes: '15 minutos de retraso.',
  },
   {
    id: 'ar4',
    date: '2024-07-27',
    shiftId: 's2',
    courseId: 'c2',
    teacherId: 't3',
    subject: 'Taller de Comunicación',
    status: 'Justificado',
    notes: 'Presentó certificado médico.',
  },
];
