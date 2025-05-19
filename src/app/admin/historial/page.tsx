import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DocenteHistorial } from '@/types/docente'

// Mock data for teacher history
const teacherHistory: DocenteHistorial[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    action: 'Creación',
    date: '15/04/2023',
    user: 'admin@gmail.com',
  },
  {
    id: 2,
    name: 'María González',
    action: 'Creación',
    date: '20/04/2023',
    user: 'admin@gmail.com',
  },
  {
    id: 3,
    name: 'Carlos Rodríguez',
    action: 'Creación',
    date: '25/04/2023',
    user: 'admin@gmail.com',
  },
  {
    id: 4,
    name: 'Ana Martínez',
    action: 'Creación',
    date: '30/04/2023',
    user: 'admin@gmail.com',
  },
  {
    id: 4,
    name: 'Ana Martínez',
    action: 'Baja',
    date: '15/05/2023',
    user: 'admin@gmail.com',
  },
  {
    id: 5,
    name: 'Roberto Sánchez',
    action: 'Creación',
    date: '10/05/2023',
    user: 'admin@gmail.com',
  },
]

export default function HistorialPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Historial de Docentes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividades</CardTitle>
          <CardDescription>
            Historial de todas las acciones realizadas sobre los docentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherHistory.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.action === 'Creación'
                          ? 'bg-[#00bf7d]/20 text-[#00bf7d]'
                          : record.action === 'Edición'
                            ? 'bg-[#0073e6]/20 text-[#0073e6]'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.action}
                    </span>
                  </TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
