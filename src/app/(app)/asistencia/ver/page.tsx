
"use client";

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useData } from '@/contexts/DataProvider';
import type { AttendanceRecord } from '@/types';
import { format }s_token_interpolation_trick from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, CalendarIcon, Edit3, User, Users, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ViewAttendancePage() {
  const { teachers, courses, getFilteredAttendanceRecords } = useData();
  const { toast } = useToast();

  const [filterTeacherId, setFilterTeacherId] = useState<string | undefined>();
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [filterCourseId, setFilterCourseId] = useState<string | undefined>();

  const displayedAttendance = useMemo(() => {
    return getFilteredAttendanceRecords({
      teacherId: filterTeacherId === 'todos' ? undefined : filterTeacherId,
      date: filterDate,
      courseId: filterCourseId === 'todos' ? undefined : filterCourseId,
    });
  }, [filterTeacherId, filterDate, filterCourseId, getFilteredAttendanceRecords]);
  
  const getTeacherName = (teacherId: string) => teachers.find(t => t.id === teacherId)?.name || 'Desconocido';
  const getCourseName = (courseId: string) => courses.find(c => c.id === courseId)?.name || 'Desconocido';

  const handleEdit = () => {
    toast({ title: "Función no disponible", description: "La edición de asistencias es solo visual en este prototipo.", variant: "default" });
  };

  return (
    <div className="container mx-auto py-2">
      <PageHeader title="Ver Asistencias" icon={Eye} description="Filtre y visualice los registros de asistencia." />

      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><Filter className="h-5 w-5 text-primary"/>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="teacher-filter" className="flex items-center mb-1"><User className="mr-2 h-4 w-4 text-primary"/>Docente</Label>
            <Select value={filterTeacherId} onValueChange={setFilterTeacherId}>
              <SelectTrigger id="teacher-filter">
                <SelectValue placeholder="Todos los docentes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los Docentes</SelectItem>
                {teachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date-filter" className="flex items-center mb-1"><CalendarIcon className="mr-2 h-4 w-4 text-primary"/>Fecha</Label>
             <Popover>
              <PopoverTrigger asChild>
                <Button id="date-filter" variant={"outline"} className="w-full justify-start text-left font-normal">
                  {filterDate ? format(filterDate, "PPP", { locale: es }) : <span>Cualquier fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus locale={es} />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="course-filter" className="flex items-center mb-1"><Users className="mr-2 h-4 w-4 text-primary"/>Curso</Label>
            <Select value={filterCourseId} onValueChange={setFilterCourseId}>
              <SelectTrigger id="course-filter">
                <SelectValue placeholder="Todos los cursos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los Cursos</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Registros de Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          {displayedAttendance.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Docente</TableHead>
                    <TableHead>Asignatura</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedAttendance.map((record: AttendanceRecord) => (
                    <TableRow key={record.id}>
                      <TableCell>{getTeacherName(record.teacherId)}</TableCell>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell>{format(new Date(record.date), "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell>{getCourseName(record.courseId)}</TableCell>
                      <TableCell>{record.status}</TableCell>
                      <TableCell>{record.notes || '-'}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={handleEdit}>
                          <Edit3 className="mr-1 h-4 w-4" /> Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No se encontraron registros con los filtros seleccionados.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
