
"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useData } from '@/contexts/DataProvider';
import type { Teacher, Course, Shift, AttendanceStatus } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ListChecks, CalendarIcon, Save, User, BookOpen, FilePenLine, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeacherAttendanceState {
  teacherId: string;
  subject: string;
  status: AttendanceStatus;
  notes?: string;
}

export default function TakeAttendancePage() {
  const { courses, shifts, teachers, addAttendanceRecord, attendanceStatusOptions } = useData();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedShiftId, setSelectedShiftId] = useState<string | undefined>(shifts[0]?.id);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(courses[0]?.id);
  
  const [attendanceData, setAttendanceData] = useState<TeacherAttendanceState[]>([]);

  const filteredTeachers = useMemo(() => {
    if (!selectedCourseId) return [];
    const course = courses.find(c => c.id === selectedCourseId);
    if (!course) return [];
    return teachers.filter(t => course.teacherIds.includes(t.id));
  }, [selectedCourseId, courses, teachers]);

  useEffect(() => {
    // Initialize attendanceData when filteredTeachers change
    const initialData: TeacherAttendanceState[] = [];
    filteredTeachers.forEach(teacher => {
      teacher.subjects.forEach(subject => {
        initialData.push({
          teacherId: teacher.id,
          subject: subject,
          status: 'Presente', // Default status
          notes: '',
        });
      });
    });
    setAttendanceData(initialData);
  }, [filteredTeachers]);

  const handleAttendanceChange = (teacherId: string, subject: string, field: keyof TeacherAttendanceState, value: string) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.teacherId === teacherId && item.subject === subject
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleSaveAttendance = () => {
    if (!selectedDate || !selectedShiftId || !selectedCourseId) {
      toast({ title: "Error", description: "Por favor, complete todos los filtros.", variant: "destructive" });
      return;
    }

    attendanceData.forEach(item => {
      addAttendanceRecord({
        date: format(selectedDate, 'yyyy-MM-dd'),
        shiftId: selectedShiftId,
        courseId: selectedCourseId,
        teacherId: item.teacherId,
        subject: item.subject,
        status: item.status,
        notes: item.notes,
      });
    });

    toast({ title: "Éxito", description: "Asistencia guardada correctamente." });
    // Optionally reset form or navigate away
  };

  return (
    <div className="container mx-auto py-2">
      <PageHeader title="Tomar Asistencia" icon={ListChecks} description="Seleccione los filtros y registre la asistencia de los docentes." />

      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Filtros de Asistencia</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date-picker" className="flex items-center mb-1"><CalendarIcon className="mr-2 h-4 w-4 text-primary"/>Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="shift-select" className="flex items-center mb-1"><Clock className="mr-2 h-4 w-4 text-primary"/>Turno</Label>
            <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
              <SelectTrigger id="shift-select" className="w-full">
                <SelectValue placeholder="Seleccione un turno" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map(shift => (
                  <SelectItem key={shift.id} value={shift.id}>{shift.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="course-select" className="flex items-center mb-1"><Users className="mr-2 h-4 w-4 text-primary"/>Curso/Sección</Label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger id="course-select" className="w-full">
                <SelectValue placeholder="Seleccione un curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredTeachers.length > 0 ? (
        <div className="space-y-6">
          {filteredTeachers.map(teacher => (
            teacher.subjects.map(subject => {
              const currentAttendance = attendanceData.find(ad => ad.teacherId === teacher.id && ad.subject === subject);
              return (
                <Card key={`${teacher.id}-${subject}`} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" /> {teacher.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> {subject}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Estado de Asistencia</Label>
                      <RadioGroup
                        value={currentAttendance?.status || 'Presente'}
                        onValueChange={(value) => handleAttendanceChange(teacher.id, subject, 'status', value as AttendanceStatus)}
                        className="flex flex-wrap gap-4"
                      >
                        {attendanceStatusOptions.map(statusOption => (
                          <div key={statusOption} className="flex items-center space-x-2">
                            <RadioGroupItem value={statusOption} id={`${teacher.id}-${subject}-${statusOption}`} />
                            <Label htmlFor={`${teacher.id}-${subject}-${statusOption}`}>{statusOption}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor={`notes-${teacher.id}-${subject}`} className="flex items-center mb-1"><FilePenLine className="mr-2 h-4 w-4 text-primary"/>Observaciones (Opcional)</Label>
                      <Textarea
                        id={`notes-${teacher.id}-${subject}`}
                        placeholder="Ingrese observaciones..."
                        value={currentAttendance?.notes || ''}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleAttendanceChange(teacher.id, subject, 'notes', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ))}
          <Button onClick={handleSaveAttendance} size="lg" className="w-full md:w-auto">
            <Save className="mr-2 h-5 w-5" />
            Guardar Asistencia
          </Button>
        </div>
      ) : (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">Seleccione un curso para ver los docentes asignados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
