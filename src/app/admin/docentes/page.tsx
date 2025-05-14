'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'

// Tipo para los docentes
type Teacher = {
  id: number
  name: string
  email: string
  department: string
  status: string
}

// Tipo para los errores del formulario
type FormErrors = {
  name?: string
  email?: string
  department?: string
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
  const [errors, setErrors] = useState<FormErrors>({})
  const { toast } = useToast()

  // Función para validar el formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido'
    }

    if (!formData.department.trim()) {
      newErrors.department = 'El departamento es obligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    // Validar el formulario
    if (!validateForm()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor, complete todos los campos obligatorios correctamente.',
        variant: 'destructive',
        icon: <XCircle className="h-4 w-4" />,
      })
      return
    }

    try {
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

      // Mostrar mensaje de éxito
      toast({
        title: 'Docente registrado',
        description: 'El docente ha sido registrado correctamente.',
        variant: 'success',
        icon: <CheckCircle2 className="h-4 w-4" />,
      })

      // Resetear formulario y cerrar panel
      setFormData({
        name: '',
        email: '',
        department: '',
        isActive: true,
      })
      setErrors({})
      setIsOpen(false)
    } catch {
      // Mostrar mensaje de error
      toast({
        title: 'Error al registrar',
        description: 'Ocurrió un error al registrar el docente.',
        variant: 'destructive',
        icon: <XCircle className="h-4 w-4" />,
      })
    }
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
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined })
                  }
                }}
                placeholder="Ingrese el nombre completo"
                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined })
                  }
                }}
                placeholder="correo@ejemplo.com"
                className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => {
                  setFormData({ ...formData, department: e.target.value })
                  if (errors.department) {
                    setErrors({ ...errors, department: undefined })
                  }
                }}
                placeholder="Ej: Matemáticas"
                className={errors.department ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.department && (
                <p className="text-red-500 text-xs mt-1">{errors.department}</p>
              )}
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
