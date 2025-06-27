"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { DocenteForm } from "@/components/docentes/docente-form"
import { useToast } from "@/hooks/use-toast"
import type { Docente, DocenteFormData } from "@/types/docente"
import { mapAPIToDocente, mapFormToAPICreate, mapFormToAPIUpdate } from "@/types/docente"
import { useCallback } from "react"
import { docenteService } from "@/services/docenteService"

export default function DocentesPage() {
  const [teachers, setTeachers] = useState<Docente[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentDocente, setCurrentDocente] = useState<Docente | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Función para cargar docentes
  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true)
      const docentesAPI = await docenteService.getAllDocentes()
      const docentesMapped = docentesAPI.map(mapAPIToDocente)
      setTeachers(docentesMapped)
    } catch (error) {
      console.error("Error al cargar docentes:", error)
      toast({
        title: "Error al cargar docentes",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  const handleSuccess = useCallback(
    async (formData: DocenteFormData) => {
      try {
        setSubmitting(true)
        console.log("📦 Datos del formulario recibidos:", formData)

        if (isEditMode && currentDocente) {
          // Actualizar
          await docenteService.updateDocente(mapFormToAPIUpdate(formData, currentDocente.id))
          toast({
            title: "Docente actualizado",
            description: "El docente ha sido actualizado correctamente.",
            variant: "default",
          })
        } else {
          // Crear nuevo
          await docenteService.createDocente(mapFormToAPICreate(formData))
          toast({
            title: "Docente registrado",
            description: "El docente ha sido registrado correctamente.",
            variant: "default",
          })
        }

        setIsOpen(false)
        setCurrentDocente(null)

        // Recargar la lista de docentes
        await fetchTeachers()
      } catch (error) {
        console.error("❌ Error en operación de docente:", error)
        toast({
          title: "Error en operación",
          description: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
          variant: "destructive",
        })
      } finally {
        setSubmitting(false)
      }
    },
    [isEditMode, currentDocente, toast, fetchTeachers],
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

  // Componente de loading para la tabla
  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Docentes</h1>
        <Button
          className="flex items-center gap-2 bg-[#00bf7d] hover:bg-[#00bf7d]/90 text-white"
          onClick={handleNewDocente}
          disabled={loading}
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
                <TableHead>Teléfono</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No hay docentes registrados
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.id}</TableCell>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.telefono || "N/A"}</TableCell>
                    <TableCell>{teacher.usuario || "N/A"}</TableCell>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#0073e6] hover:bg-[#0073e6]/10 bg-transparent"
                          onClick={() => handleEditDocente(teacher)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle>
              {submitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditMode ? "Actualizando..." : "Guardando..."}
                </div>
              ) : isEditMode ? (
                "Editar Docente"
              ) : (
                "Nuevo Docente"
              )}
            </SheetTitle>
            <SheetDescription>
              {isEditMode
                ? "Modifique los datos del docente y guarde los cambios."
                : "Complete el formulario para registrar un nuevo docente."}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <DocenteForm onSubmit={handleSuccess} docente={currentDocente ?? undefined} isEditMode={isEditMode} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
