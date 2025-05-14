'use client'

import { useState } from 'react'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

// Tipo para los docentes
type Teacher = {
  id: number
  name: string
  email: string
  department: string
  status: string
}

// Mock data for teachers
const initialTeachers = [
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
  const [isOpen, setIsOpen] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    isActive: true,
  })

  const handleSubmit = () => {
    // Crear nuevo docente
    const newTeacher = {
      id: teachers.length > 0 ? Math.max(...teachers.map((t) => t.id)) + 1 : 1,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      status: formData.isActive ? 'Activo' : 'Inactivo',
    }

    // Agregar a la lista
    setTeachers([...teachers, newTeacher])

    // Resetear formulario y cerrar panel
    setFormData({
      name: '',
      email: '',
      department: '',
      isActive: true,
    })
    setIsOpen(false)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Docentes</h1>
        <Button
          className="flex items-center gap-2 bg-[#00bf7d] hover:bg-[#00bf7d]/90 text-white"
          onClick={() => setIsOpen(true)}
        >
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
                          ? 'bg-[#00bf7d]/20 text-[#00bf7d]'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#0073e6] hover:bg-[#0073e6]/10"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 border-red-500 hover:bg-red-50"
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
      {/* Deslizador lateral con formulario */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Nuevo Docente</SheetTitle>
            <SheetDescription>
              Complete el formulario para registrar un nuevo docente en el sistema.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ingrese el nombre completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Ej: Matemáticas"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Estado activo</Label>
              <Switch
                id="status"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <SheetFooter>
            <Button
              className="w-full bg-[#00bf7d] hover:bg-[#00bf7d]/90 text-white"
              onClick={handleSubmit}
            >
              Registrar Docente
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
