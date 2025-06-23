'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
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
import adminService from '@/services/adminService'
import { mapAdminToUI, mapFormToAPI, type AdminFormData } from '@/types/admin'

interface UIAdmin {
  id: string
  name: string
  email: string
  username: string
  status: 'Activo' | 'Inactivo'
  created_at: string
  updated_at?: string
}

export default function GestionAdministradoresPage() {
  const [admins, setAdmins] = useState<UIAdmin[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<UIAdmin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Cargar administradores al montar el componente
  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    console.log('📋 GestionAdmins: Loading admins...')
    setIsLoading(true)

    try {
      const adminData = await adminService.getAllAdmins()
      const uiAdmins = adminData.map(mapAdminToUI)

      console.log('✅ GestionAdmins: Admins loaded:', uiAdmins.length)
      setAdmins(uiAdmins)
    } catch (error) {
      console.error('❌ GestionAdmins: Error loading admins:', error)
      toast({
        title: 'Error al cargar administradores',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Contar administradores activos
  const activeAdminsCount = admins.filter((admin) => admin.status === 'Activo').length

  const handleSuccess = useCallback(
    async (formData: AdminFormData) => {
      console.log('📝 GestionAdmins: Creating new admin...')
      setIsSubmitting(true)

      try {
        const apiData = mapFormToAPI(formData)
        const newAdmin = await adminService.createAdmin(apiData)
        const uiAdmin = mapAdminToUI(newAdmin)

        console.log('✅ GestionAdmins: Admin created successfully')
        setAdmins((prevAdmins) => [uiAdmin, ...prevAdmins])
        setIsOpen(false)

        toast({
          title: 'Administrador creado',
          description: 'El administrador ha sido registrado correctamente.',
          variant: 'success',
        })
      } catch (error) {
        console.error('❌ GestionAdmins: Error creating admin:', error)
        toast({
          title: 'Error al crear administrador',
          description: error instanceof Error ? error.message : 'Error desconocido',
          variant: 'destructive',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [toast],
  )

  const handleNewAdmin = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleToggleStatus = useCallback(
    async (admin: UIAdmin) => {
      console.log('🔄 GestionAdmins: Toggling admin status:', admin.id)

      // Verificar si hay suficientes administradores activos antes de desactivar
      if (admin.status === 'Activo' && activeAdminsCount <= 1) {
        setCurrentAdmin(admin)
        setIsSecurityDialogOpen(true)
        return
      }

      try {
        const newStatus = admin.status === 'Activo' ? false : true
        await adminService.toggleAdminStatus(admin.id, newStatus)

        console.log('✅ GestionAdmins: Admin status toggled successfully')
        setAdmins((prevAdmins) =>
          prevAdmins.map((a) =>
            a.id === admin.id ? { ...a, status: newStatus ? 'Activo' : 'Inactivo' } : a,
          ),
        )

        toast({
          title: `Administrador ${newStatus ? 'activado' : 'desactivado'}`,
          description: `El administrador ha sido ${newStatus ? 'activado' : 'desactivado'} correctamente.`,
          variant: 'success',
        })
      } catch (error) {
        console.error('❌ GestionAdmins: Error toggling status:', error)
        toast({
          title: 'Error al cambiar estado',
          description: error instanceof Error ? error.message : 'Error desconocido',
          variant: 'destructive',
        })
      }
    },
    [activeAdminsCount, toast],
  )

  const handleDeleteClick = useCallback(
    (admin: UIAdmin) => {
      setCurrentAdmin(admin)

      // Verificar si hay suficientes administradores activos
      if (activeAdminsCount <= 1 && admin.status === 'Activo') {
        setIsSecurityDialogOpen(true)
      } else {
        setIsDeleteDialogOpen(true)
      }
    },
    [activeAdminsCount],
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (!currentAdmin) return

    console.log('🗑️ GestionAdmins: Deleting admin:', currentAdmin.id)
    setIsDeleteDialogOpen(false)

    try {
      await adminService.deleteAdmin(currentAdmin.id)

      console.log('✅ GestionAdmins: Admin deleted successfully')
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== currentAdmin.id))

      toast({
        title: 'Administrador eliminado',
        description: 'El administrador ha sido eliminado correctamente.',
        variant: 'success',
      })
    } catch (error) {
      console.error('❌ GestionAdmins: Error deleting admin:', error)
      toast({
        title: 'Error al eliminar',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
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
        <div>
          <h1 className="text-3xl font-bold">Gestión de Administradores</h1>
          <p className="text-muted-foreground mt-1">
            {admins.length} administradores registrados ({activeAdminsCount} activos)
          </p>
        </div>
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
            Administre los usuarios con acceso al sistema. Puede crear, activar/desactivar o
            eliminar administradores.
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
                <TableHead>Fecha de Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.username}</TableCell>
                  <TableCell>{admin.name}</TableCell>
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
                  <TableCell>{new Date(admin.created_at).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${
                          admin.status === 'Activo'
                            ? 'text-orange-500 hover:text-orange-700 border-orange-500 hover:bg-orange-50'
                            : 'text-green-500 hover:text-green-700 border-green-500 hover:bg-green-50'
                        }`}
                        onClick={() => handleToggleStatus(admin)}
                      >
                        {admin.status === 'Activo' ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
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
            <SheetTitle>Nuevo Administrador</SheetTitle>
            <SheetDescription>
              Complete el formulario para registrar un nuevo administrador.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <AdministradorForm onSubmit={handleSuccess} isLoading={isSubmitting} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este administrador?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El administrador será eliminado permanentemente del
              sistema.
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

      {/* Diálogo de seguridad para evitar eliminar cuando hay pocos administradores */}
      <AlertDialog open={isSecurityDialogOpen} onOpenChange={setIsSecurityDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Operación no permitida</AlertDialogTitle>
            <AlertDialogDescription>
              Por razones de seguridad, no es posible realizar esta acción. El sistema debe mantener
              al menos 1 administrador activo en todo momento.
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
