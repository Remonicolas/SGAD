
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
import type { ReportSummary } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart3, CalendarIcon, User, Users, FileText, FileSpreadsheet, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { DateRange } from "react-day-picker"
import { Label } from '@/components/ui/label';

export default function ReportsPage() {
  const { teachers, courses, getAttendanceForReport } = useData();
  const { toast } = useToast();

  const [filterDateRange, setFilterDateRange] = useState<DateRange | undefined>();
  const [filterTeacherId, setFilterTeacherId] = useState<string | undefined>();
  const [filterCourseId, setFilterCourseId] = useState<string | undefined>();

  const reportData: ReportSummary[] = useMemo(() => {
    return getAttendanceForReport({
      dateFrom: filterDateRange?.from,
      dateTo: filterDateRange?.to,
      teacherId: filterTeacherId === 'todos' ? undefined : filterTeacherId,
      courseId: filterCourseId === 'todos' ? undefined : filterCourseId,
    });
  }, [filterDateRange, filterTeacherId, filterCourseId, getAttendanceForReport]);

  const handleExport = (format: 'PDF' | 'Excel') => {
    toast({ title: "Función no disponible", description: `La exportación a ${format} es solo visual en este prototipo.`, variant: "default" });
  };
  
  return (
    <div className="container mx-auto py-2">
      <PageHeader title="Reportes de Asistencia" icon={BarChart3} description="Genere y visualice resúmenes de asistencia." />

      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><Filter className="h-5 w-5 text-primary"/>Filtros del Reporte</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date-range-picker" className="flex items-center mb-1"><CalendarIcon className="mr-2 h-4 w-4 text-primary"/>Rango de Fechas</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range-picker"
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  {filterDateRange?.from ? (
                    filterDateRange.to ? (
                      <>
                        {format(filterDateRange.from, "LLL dd, y", { locale: es })} -{" "}
                        {format(filterDateRange.to, "LLL dd, y", { locale: es })}
                      </>
                    ) : (
                      format(filterDateRange.from, "LLL dd, y", { locale: es })
                    )
                  ) : (
                    <span>Seleccione un rango</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filterDateRange?.from}
                  selected={filterDateRange}
                  onSelect={setFilterDateRange}
                  numberOfMonths={2}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="teacher-filter-report" className="flex items-center mb-1"><User className="mr-2 h-4 w-4 text-primary"/>Docente</Label>
            <Select value={filterTeacherId} onValueChange={setFilterTeacherId}>
              <SelectTrigger id="teacher-filter-report">
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
            <Label htmlFor="course-filter-report" className="flex items-center mb-1"><Users className="mr-2 h-4 w-4 text-primary"/>Curso</Label>
            <Select value={filterCourseId} onValueChange={setFilterCourseId}>
              <SelectTrigger id="course-filter-report">
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Resumen de Asistencia por Docente</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('PDF')}>
              <FileText className="mr-2 h-4 w-4" /> Exportar a PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('Excel')}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar a Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reportData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Docente</TableHead>
                    <TableHead className="text-center">Presente</TableHead>
                    <TableHead className="text-center">Ausente</TableHead>
                    <TableHead className="text-center">Llegó Tarde</TableHead>
                    <TableHead className="text-center">Justificado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map(summary => (
                    <TableRow key={summary.teacherId}>
                      <TableCell>{summary.teacherName}</TableCell>
                      <TableCell className="text-center">{summary.presente}</TableCell>
                      <TableCell className="text-center">{summary.ausente}</TableCell>
                      <TableCell className="text-center">{summary.llegóTarde}</TableCell>
                      <TableCell className="text-center">{summary.justificado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No hay datos para mostrar con los filtros seleccionados.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
