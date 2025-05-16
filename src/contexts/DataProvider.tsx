
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import type { Teacher, Course, Shift, AttendanceRecord, ReportSummary, AttendanceStatus } from '@/types';
import { TEACHERS_LIST, COURSES_LIST, SHIFTS_LIST, MOCK_INITIAL_ATTENDANCE_RECORDS, ALL_SUBJECTS, ATTENDANCE_STATUS_OPTIONS } from '@/lib/mockData';
import { format } from 'date-fns';

interface DataContextType {
  teachers: Teacher[];
  courses: Course[];
  shifts: Shift[];
  allSubjects: string[];
  attendanceStatusOptions: AttendanceStatus[];
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  getAttendanceForReport: (filters: { dateFrom?: Date; dateTo?: Date; teacherId?: string; courseId?: string }) => ReportSummary[];
  getFilteredAttendanceRecords: (filters: { teacherId?: string; date?: Date; courseId?: string }) => AttendanceRecord[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_INITIAL_ATTENDANCE_RECORDS);

  const addAttendanceRecord = useCallback((record: Omit<AttendanceRecord, 'id'>) => {
    setAttendanceRecords(prevRecords => [
      ...prevRecords,
      { ...record, id: `ar${prevRecords.length + Date.now()}` }
    ]);
  }, []);

  const getFilteredAttendanceRecords = useCallback((filters: { teacherId?: string; date?: Date; courseId?: string }): AttendanceRecord[] => {
    return attendanceRecords.filter(record => {
      const dateMatch = filters.date ? record.date === format(filters.date, 'yyyy-MM-dd') : true;
      const teacherMatch = filters.teacherId ? record.teacherId === filters.teacherId : true;
      const courseMatch = filters.courseId ? record.courseId === filters.courseId : true;
      return dateMatch && teacherMatch && courseMatch;
    });
  }, [attendanceRecords]);
  
  const getAttendanceForReport = useCallback((filters: { dateFrom?: Date; dateTo?: Date; teacherId?: string; courseId?: string }): ReportSummary[] => {
    const filteredRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const dateFromMatch = filters.dateFrom ? recordDate >= filters.dateFrom : true;
      const dateToMatch = filters.dateTo ? recordDate <= filters.dateTo : true;
      const teacherMatch = filters.teacherId ? record.teacherId === filters.teacherId : true;
      const courseMatch = filters.courseId ? record.courseId === filters.courseId : true;
      return dateFromMatch && dateToMatch && teacherMatch && courseMatch;
    });

    const summaryMap = new Map<string, ReportSummary>();

    filteredRecords.forEach(record => {
      if (!summaryMap.has(record.teacherId)) {
        const teacher = TEACHERS_LIST.find(t => t.id === record.teacherId);
        summaryMap.set(record.teacherId, {
          teacherId: record.teacherId,
          teacherName: teacher?.name || 'Desconocido',
          presente: 0,
          ausente: 0,
          llegóTarde: 0,
          justificado: 0,
        });
      }

      const summary = summaryMap.get(record.teacherId)!;
      switch (record.status) {
        case 'Presente': summary.presente++; break;
        case 'Ausente': summary.ausente++; break;
        case 'Llegó Tarde': summary.llegóTarde++; break;
        case 'Justificado': summary.justificado++; break;
      }
    });
    return Array.from(summaryMap.values());
  }, [attendanceRecords]);


  const value = useMemo(() => ({
    teachers: TEACHERS_LIST,
    courses: COURSES_LIST,
    shifts: SHIFTS_LIST,
    allSubjects: ALL_SUBJECTS,
    attendanceStatusOptions: ATTENDANCE_STATUS_OPTIONS,
    attendanceRecords,
    addAttendanceRecord,
    getAttendanceForReport,
    getFilteredAttendanceRecords,
  }), [attendanceRecords, addAttendanceRecord, getAttendanceForReport, getFilteredAttendanceRecords]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
