"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { AdministradorForm } from "@/components/administradores/administrador-form"
import type { Administrador, AdministradorFormData } from "@/types/administrador"
import { formatAdminForDisplay } from "@/types/administrador"
import adminService from "@/services/adminService"

export default function GestionAdministradoresPage() {
  const [admins, setAdmins] = useState<Administrador[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<Administrador | null>(null)
  const [securityMessage, setSecurityMessage] = useState("")
  const { toast } = useToast()

  // Cargar administradores al montar el componente
  const loadAdmins = useCallback(async () => {
    console.log("📋 GestionAdmins: Loading administrators...")
    setIsLoading(true)

    try {
      const adminData = await adminService.getAllAdmins()
      console.log("✅ GestionAdmins: Administrators loaded:", adminData.length)
      setAdmins(adminData)
    } catch (error) {
      console.error("❌ GestionAdmins: Error loading administrators:", error)
      toast({
        title: "Error al cargar administradores",
        description: "No se pudieron cargar los administradores. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadAdmins()
  }, [loadAdmins])

  // Contar administradores activos
  const activeAdminsCount = admins.filter((admin) => admin.is_active).length

  const handleCreateAdmin = useCallback(
    async (formData: AdministradorFormData) => {
      console.log("👥 GestionAdmins: Creating new administrator...")
      setIsFormLoading(true)

      try {
        const createData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
        }

        const newAdmin = await adminService.createAdmin(createData)
        console.log("✅ GestionAdmins: Administrator created successfully")

        // Actualizar la lista
        setAdmins((prevAdmins) => [...prevAdmins, newAdmin])
        setIsOpen(false)

        toast({
          title: "Administrador creado",
          description: "El administrador ha sido creado correctamente.",
          variant: "success",
        })
      } catch (error) {
        console.error("❌ GestionAdmins: Error creating administrator:", error)
        toast({
          title: "Error al crear administrador",
          description: error instanceof Error ? error.message : "Error desconocido",
          variant: "destructive",
        })
      } finally {
        setIsFormLoading(false)
      }
    },
    [toast],
  )

  const handleNewAdmin = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleDeleteClick = useCallback(
    async (admin: Administrador) => {
      console.log("🗑️ GestionAdmins: Checking delete permissions for:", admin._id)
      setCurrentAdmin(admin)

      try {
        const { canDelete, reason } = await adminService.canDeleteAdmin(admin._id)

        if (!canDelete) {
          console.log("⚠️ GestionAdmins: Delete not allowed:", reason)
          setSecurityMessage(reason || "No se puede eliminar este administrador")
          setIsSecurityDialogOpen(true)
        } else {
          console.log("✅ GestionAdmins: Delete allowed")
          setIsDeleteDialogOpen(true)
        }
      } catch (error) {
        console.error("❌ GestionAdmins: Error checking delete permissions:", error)
        toast({
          title: "Error",
          description: "No se pudo verificar si se puede eliminar el administrador.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (!currentAdmin) return

    console.log("🗑️ GestionAdmins: Deleting administrator:", currentAdmin._id)
    setIsDeleteDialogOpen(false)

    try {
      await adminService.deleteAdmin(currentAdmin._id)
      console.log("✅ GestionAdmins: Administrator deleted successfully")

      // Actualizar la lista
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== currentAdmin._id))

      toast({
        title: "Administrador eliminado",
        description: "El administrador ha sido eliminado correctamente.",
        variant: "success",
      })
    } catch (error) {
      console.error("❌ GestionAdmins: Error deleting administrator:", error)
      toast({
        title: "Error al eliminar",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setCurrentAdmin(null)
    }
  }, [currentAdmin, toast])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00bf7d]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Administradores</h1>
        <Button
          className="flex items-center gap-2 bg-[#00bf7d] hover:bg-[#00bf7d]/90 text-white"
          onClick={handleNewAdmin}
        >
          <PlusCircle className="h-4 w-4" />
          Nuevo Administrador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Administradores</CardTitle>
          <CardDescription>
            Administre los usuarios con acceso al sistema. Puede crear o eliminar administradores.
            {activeAdminsCount > 0 && (
              <span className="block mt-1 text-sm text-[#00bf7d]">Administradores activos: {activeAdminsCount}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => {
                const displayAdmin = formatAdminForDisplay(admin)
                return (
                  <TableRow key={admin._id}>
                    <TableCell className="font-medium">{admin.username}</TableCell>
                    <TableCell>{displayAdmin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          admin.is_active ? "bg-[#00bf7d]/20 text-[#00bf7d]" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {displayAdmin.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(admin.created_at).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 border-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteClick(admin)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle>Nuevo Administrador</SheetTitle>
            <SheetDescription>Complete el formulario para registrar un nuevo administrador.</SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <AdministradorForm onSubmit={handleCreateAdmin} isLoading={isFormLoading} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este administrador?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El administrador será eliminado permanentemente del sistema.
              {currentAdmin && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <strong>Usuario:</strong> {currentAdmin.username}
                  <br />
                  <strong>Nombre:</strong> {currentAdmin.first_name} {currentAdmin.last_name}
                  <br />
                  <strong>Email:</strong> {currentAdmin.email}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600 text-white">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de seguridad para evitar eliminar cuando hay pocos administradores */}
      <AlertDialog open={isSecurityDialogOpen} onOpenChange={setIsSecurityDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No se puede eliminar el administrador</AlertDialogTitle>
            <AlertDialogDescription>{securityMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Entendido</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
