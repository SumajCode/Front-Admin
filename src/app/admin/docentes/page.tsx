import { Button } from '@/components/ui/button'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock data for teachers
const teachers = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    department: 'Matemáticas',
    status: 'Activo',
  },
  {
    id: 2,
    name: 'María González',
    email: 'maria.gonzalez@example.com',
    department: 'Ciencias Politicas',
    status: 'Activo',
  },
  {
    id: 3,
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@example.com',
    department: 'Biología',
    status: 'Activo',
  },
  {
    id: 4,
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    department: 'Electrónica',
    status: 'Inactivo',
  },
  {
    id: 5,
    name: 'Roberto Sánchez',
    email: 'roberto.sanchez@example.com',
    department: 'Física',
    status: 'Activo',
  },
]

export default function DocentesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Docentes</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Nuevo Docente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Docentes</CardTitle>
          <CardDescription>
            Administre los docentes de la institución. Puede crear, editar o dar de baja docentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.id}</TableCell>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.status === 'Activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
