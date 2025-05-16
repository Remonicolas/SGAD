
"use client";

import { useAuth } from '@/contexts/AuthProvider';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LayoutDashboard, ListChecks, Eye, BarChart3, Settings, CalendarDays } from 'lucide-react';

const quickLinks = [
  { title: 'Tomar Asistencia', href: '/asistencia/tomar', icon: ListChecks, description: 'Registrar la asistencia de los docentes.' },
  { title: 'Ver Asistencias', href: '/asistencia/ver', icon: Eye, description: 'Consultar registros de asistencia.' },
  { title: 'Generar Reportes', href: '/reportes', icon: BarChart3, description: 'Visualizar estadísticas y exportar datos.' },
  { title: 'Configuración', href: '/configuracion', icon: Settings, description: 'Ajustar preferencias de la cuenta.' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const currentDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title={`Bienvenido, ${user?.name || 'Usuario'}`}
        description={`Rol: ${user?.role || 'No definido'}`}
        icon={LayoutDashboard}
      />
      
      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-6 w-6 text-primary" />
            Fecha Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground">{currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {quickLinks.map((link) => (
          <Link href={link.href} key={link.title} legacyBehavior>
            <a className="block hover:no-underline">
              <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer_ hover:border-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium text-primary">{link.title}</CardTitle>
                  <link.icon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
