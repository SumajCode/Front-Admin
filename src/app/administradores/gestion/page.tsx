'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, Trash2, Pencil, ToggleLeft, ToggleRight } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'
import { AdministradorForm } from '@/components/administradores/administrador-form'
import type {
  Administrador,
  AdministradorFormData,
  AdministradorEditFormData,
} from '@/types/administrador'
import adminService from '@/services/adminService'

export default function GestionAdministradoresPage() {
  const [admins, setAdmins] = useState<Administrador[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<Administrador | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const loadAdmins = useCallback(async () => {
    setLoading(true)
    try {
      const apiAdmins = await adminService.getAllAdmins()
      const { mapAdminFromAPI } = await import('@/types/administrador')
      const mappedAdmins = apiAdmins.map(mapAdminFromAPI)
      setAdmins(mappedAdmins)
    } catch (error) {
      toast({
        title: 'Error al cargar administradores',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadAdmins()
  }, [loadAdmins])

  const activeAdminsCount = admins.filter((admin) => admin.status === 'Activo').length

  const handleSuccess = useCallback(
    async (success: boolean, formData?: AdministradorFormData | AdministradorEditFormData) => {
      if (!success) {
        toast({
          title: isEditMode ? 'Error al actualizar' : 'Error al crear',
          description: 'La operación falló. Intente nuevamente.',
          variant: 'destructive',
        })
        setIsOpen(false)
        return
      }

      if (!formData) {
        setIsOpen(false)
        return
      }

      setActionLoading(isEditMode ? 'updating' : 'creating')

      try {
        if (isEditMode && currentAdmin) {
          const { mapEditFormDataToAPI, mapAdminFromAPI } = await import('@/types/administrador')
          const apiData = mapEditFormDataToAPI(formData as AdministradorEditFormData)
          const updatedAdmin = await adminService.updateAdmin(currentAdmin.id, apiData)
          const mappedAdmin = mapAdminFromAPI(updatedAdmin)
          setAdmins((prev) => prev.map((a) => (a.id === currentAdmin.id ? mappedAdmin : a)))
          toast({
            title: 'Administrador actualizado',
            description: 'El administrador ha sido actualizado correctamente.',
            variant: 'success',
          })
        } else {
          const { mapFormDataToAPI, mapAdminFromAPI } = await import('@/types/administrador')
          const apiData = mapFormDataToAPI(formData as AdministradorFormData)
          const newAdmin = await adminService.createAdmin(apiData)
          const mappedAdmin = mapAdminFromAPI(newAdmin)
          setAdmins((prev) => [mappedAdmin, ...prev])
          toast({
            title: 'Administrador creado',
            description: 'El administrador ha sido creado correctamente.',
            variant: 'success',
          })
        }
      } catch (error) {
        toast({
          title: isEditMode ? 'Error al actualizar' : 'Error al crear',
          description: error instanceof Error ? error.message : 'Error desconocido',
          variant: 'destructive',
        })
      } finally {
        setActionLoading(null)
        setIsOpen(false)
        setCurrentAdmin(null)
        setIsEditMode(false)
      }
    },
    [isEditMode, currentAdmin, toast],
  )

  const handleNewAdmin = useCallback(() => {
    setIsEditMode(false)
    setCurrentAdmin(null)
    setIsOpen(true)
  }, [])

  const handleEditAdmin = useCallback((admin: Administrador) => {
    setIsEditMode(true)
    setCurrentAdmin(admin)
    setIsOpen(true)
  }, [])

  const handleDeleteClick = useCallback(
    (admin: Administrador) => {
      setCurrentAdmin(admin)
      if (activeAdminsCount <= 2 && admin.status === 'Activo') {
        setIsSecurityDialogOpen(true)
      } else {
        setIsDeleteDialogOpen(true)
      }
    },
    [activeAdminsCount],
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (!currentAdmin) return

    setIsDeleteDialogOpen(false)
    setActionLoading(`deleting-${currentAdmin.id}`)

    try {
      await adminService.deleteAdmin(currentAdmin.id)
      setAdmins((prev) => prev.filter((a) => a.id !== currentAdmin.id))
      toast({
        title: 'Administrador eliminado',
        description: 'El administrador ha sido eliminado correctamente.',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error al eliminar',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(null)
      setCurrentAdmin(null)
    }
  }, [currentAdmin, toast])

  const handleToggleStatus = useCallback(
    async (admin: Administrador) => {
      const newStatus = admin.status === 'Activo' ? false : true
      if (admin.status === 'Activo' && activeAdminsCount <= 2) {
        setCurrentAdmin(admin)
        setIsSecurityDialogOpen(true)
        return
      }

      setActionLoading(`toggling-${admin.id}`)

      try {
        const { mapAdminFromAPI } = await import('@/types/administrador')
        const updatedAdmin = await adminService.toggleAdminStatus(admin.id, newStatus)
        const mappedAdmin = mapAdminFromAPI(updatedAdmin)
        setAdmins((prev) => prev.map((a) => (a.id === admin.id ? mappedAdmin : a)))
        toast({
          title: 'Estado actualizado',
          description: `El administrador ha sido ${newStatus ? 'activado' : 'desactivado'} correctamente.`,
          variant: 'success',
        })
      } catch (error) {
        toast({
          title: 'Error al cambiar estado',
          description: error instanceof Error ? error.message : 'Error desconocido',
          variant: 'destructive',
        })
      } finally {
        setActionLoading(null)
      }
    },
    [activeAdminsCount, toast],
  )

  if (loading) {
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
          disabled={actionLoading === 'creating'}
        >
          <PlusCircle className="h-4 w-4" />
          {actionLoading === 'creating' ? 'Creando...' : 'Nuevo Administrador'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Administradores</CardTitle>
          <CardDescription>
            Administre los usuarios con acceso al sistema. Puede crear, editar o eliminar
            administradores.
            <br />
            <span className="text-sm text-muted-foreground">
              Total: {admins.length} | Activos: {activeAdminsCount} | Inactivos:{' '}
              {admins.length - activeAdminsCount}
            </span>
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
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-mono text-sm">{admin.username}</TableCell>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        admin.status === 'Activo'
                          ? 'bg-[#00bf7d]/20 text-[#00bf7d]'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {admin.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#0073e6] hover:bg-[#0073e6]/10"
                        onClick={() => handleEditAdmin(admin)}
                        disabled={actionLoading === 'updating'}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${
                          admin.status === 'Activo'
                            ? 'border-orange-500 hover:bg-orange-50 text-orange-600'
                            : 'border-green-500 hover:bg-green-50 text-green-600'
                        }`}
                        onClick={() => handleToggleStatus(admin)}
                        disabled={actionLoading === `toggling-${admin.id}`}
                      >
                        {actionLoading === `toggling-${admin.id}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : admin.status === 'Activo' ? (
                          <ToggleLeft className="h-4 w-4" />
                        ) : (
                          <ToggleRight className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {admin.status === 'Activo' ? 'Desactivar' : 'Activar'}
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 border-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteClick(admin)}
                        disabled={actionLoading === `deleting-${admin.id}`}
                      >
                        {actionLoading === `deleting-${admin.id}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {admins.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay administradores registrados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle>{isEditMode ? 'Editar Administrador' : 'Nuevo Administrador'}</SheetTitle>
            <SheetDescription>
              {isEditMode
                ? 'Modifique los datos del administrador y guarde los cambios.'
                : 'Complete el formulario para registrar un nuevo administrador.'}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <AdministradorForm
              onSubmit={handleSuccess}
              administrador={currentAdmin}
              isEditMode={isEditMode}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este administrador?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El administrador será eliminado permanentemente del
              sistema.
              {currentAdmin && (
                <div className="mt-2 p-2 bg-muted rounded">
                  <strong>Usuario:</strong> {currentAdmin.username}
                  <br />
                  <strong>Nombre:</strong> {currentAdmin.name}
                  <br />
                  <strong>Email:</strong> {currentAdmin.email}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
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

      <AlertDialog open={isSecurityDialogOpen} onOpenChange={setIsSecurityDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No se puede realizar esta acción</AlertDialogTitle>
            <AlertDialogDescription>
              Por razones de seguridad, no es posible eliminar o desactivar este administrador. El
              sistema debe mantener al menos 2 administradores activos en todo momento.
              <br />
              <br />
              <strong>Administradores activos actuales:</strong> {activeAdminsCount}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Entendido</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
