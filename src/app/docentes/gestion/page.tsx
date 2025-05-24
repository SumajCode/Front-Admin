'use client'

import { useState, useEffect } from 'react'
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { DocenteForm } from '@/components/docentes/docente-form'
import { useToast } from '@/hooks/use-toast'
import type { Docente } from '@/types/docente'
import { useCallback } from 'react'
import docentesData from '@/data/docentes.json'

export default function DocentesPage() {
  const [teachers, setTeachers] = useState<Docente[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentDocente, setCurrentDocente] = useState<Docente | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [simulateDeleteSuccess, setSimulateDeleteSuccess] = useState(true)
  const { toast } = useToast()

  // Cargar datos al montar el componente
  useEffect(() => {
    setTeachers(docentesData.docentes as Docente[])
  }, [])

  const handleSuccess = useCallback(
    (success: boolean) => {
      setIsOpen(false)

      toast({
        title: isEditMode ? 'Docente actualizado' : 'Docente registrado',
        description: isEditMode
          ? 'El docente ha sido actualizado correctamente.'
          : 'El docente ha sido registrado correctamente.',
        variant: success ? 'success' : 'destructive',
      })
    },
    [isEditMode, toast],
  )

  const handleNewDocente = useCallback(() => {
    setIsEditMode(false)
    setCurrentDocente(null)
    setIsOpen(true)
  }, [])

  const handleEditDocente = useCallback((docente: Docente) => {
    setIsEditMode(true)
    setCurrentDocente(docente)
    setIsOpen(true)
  }, [])

  const handleDeleteClick = useCallback((docente: Docente) => {
    setCurrentDocente(docente)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    setIsDeleteDialogOpen(false)

    if (simulateDeleteSuccess && currentDocente) {
      setTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher.id !== currentDocente.id),
      )

      toast({
        title: 'Docente eliminado',
        description: 'El docente ha sido eliminado correctamente.',
        variant: 'success',
      })
    } else {
      toast({
        title: 'Error al eliminar',
        description: 'No se pudo eliminar el docente. Intente nuevamente.',
        variant: 'destructive',
      })
    }

    setCurrentDocente(null)
  }, [currentDocente, simulateDeleteSuccess, toast])

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Docentes</h1>
        <Button
          className="flex items-center gap-2 bg-[#00bf7d] hover:bg-[#00bf7d]/90 text-white"
          onClick={handleNewDocente}
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
                        onClick={() => handleEditDocente(teacher)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 border-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteClick(teacher)}
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
            <SheetTitle>{isEditMode ? 'Editar Docente' : 'Nuevo Docente'}</SheetTitle>
            <SheetDescription>
              {isEditMode
                ? 'Modifique los datos del docente y guarde los cambios.'
                : 'Complete el formulario para registrar un nuevo docente.'}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <DocenteForm
              onSubmit={handleSuccess}
              docente={currentDocente ?? undefined}
              isEditMode={isEditMode}
            />
          </div>
        </SheetContent>
      </Sheet>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este docente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El docente será eliminado permanentemente del
              sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex items-center space-x-2 py-4">
            <Switch
              id="simulate-delete-success"
              checked={simulateDeleteSuccess}
              onCheckedChange={setSimulateDeleteSuccess}
            />
            <label
              htmlFor="simulate-delete-success"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {simulateDeleteSuccess
                ? 'Simular eliminación exitosa'
                : 'Simular error de eliminación'}
            </label>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
