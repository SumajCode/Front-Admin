"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DocenteForm } from "@/components/docente-form"
import { useToast } from "@/hooks/use-toast"

// Mock data for teachers
const teachers = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    facultades: ["Facultad de Ciencias y Tecnología", "Facultad de Ciencias Económicas"],
    status: "Activo",
  },
  {
    id: 2,
    name: "María González",
    email: "maria.gonzalez@example.com",
    facultades: ["Facultad de Ciencias Jurídicas y Políticas"],
    status: "Activo",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    facultades: ["Facultad de Ciencias Bioquímicas y Farmacéuticas"],
    status: "Activo",
  },
  {
    id: 4,
    name: "Ana Martínez",
    email: "ana.martinez@example.com",
    facultades: ["Facultad de Ciencias y Tecnología"],
    status: "Inactivo",
  },
  {
    id: 5,
    name: "Roberto Sánchez",
    email: "roberto.sanchez@example.com",
    facultades: ["Facultad de Medicina", "Facultad de Ciencias Sociales"],
    status: "Activo",
  },
]

export default function DocentesPage() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleSuccess = (success: boolean) => {
    setIsOpen(false)

    if (success) {
      toast({
        title: "Docente registrado",
        description: "El docente ha sido registrado correctamente.",
        variant: "success",
      })
    } else {
      toast({
        title: "Error al registrar",
        description: "No se pudo registrar el docente. Intente nuevamente.",
        variant: "destructive",
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
                <TableHead>Facultades</TableHead>
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
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {teacher.facultades.map((facultad, index) => (
                        <span key={index} className="text-xs">
                          {facultad}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.status === "Activo" ? "bg-[#00bf7d]/20 text-[#00bf7d]" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-[#0073e6] hover:bg-[#0073e6]/10">
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

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle>Nuevo Docente</SheetTitle>
            <SheetDescription>Complete el formulario para registrar un nuevo docente.</SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <DocenteForm onSubmit={handleSuccess} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
