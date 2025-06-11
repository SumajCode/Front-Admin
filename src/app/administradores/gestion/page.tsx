'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, Trash2 } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'
import { AdministradorForm } from '@/components/administradores/administrador-form'
import type { Administrador } from '@/types/administrador'
import administradoresData from '@/data/administradores.json'

export default function GestionAdministradoresPage() {
  const [admins, setAdmins] = useState<Administrador[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<Administrador | null>(null)
  const [simulateDeleteSuccess, setSimulateDeleteSuccess] = useState(true)
  const { toast } = useToast()

  // Cargar datos al montar el componente
  useEffect(() => {
    setAdmins(administradoresData.administradores as Administrador[])
  }, [])

  // Contar administradores activos
  const activeAdminsCount = admins.filter((admin) => admin.status === 'Activo').length

  const handleSuccess = useCallback(
    (success: boolean) => {
      setIsOpen(false)

      toast({
        title: 'Administrador registrado',
        description: 'El administrador ha sido registrado correctamente.',
        variant: success ? 'success' : 'destructive',
      })

      if (success) {
        // Simular la adición de un nuevo administrador
        const newId = Math.max(...admins.map((admin) => admin.id)) + 1
        setAdmins((prevAdmins) => [
          ...prevAdmins,
          {
            id: newId,
            name: 'Nuevo Administrador',
            email: 'nuevo.admin@example.com',
            status: 'Activo',
          },
        ])
      }
    },
    [admins, toast],
  )

  const handleNewAdmin = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleDeleteClick = useCallback(
    (admin: Administrador) => {
      setCurrentAdmin(admin)

      // Verificar si hay suficientes administradores activos
      if (activeAdminsCount <= 2 && admin.status === 'Activo') {
        setIsSecurityDialogOpen(true)
      } else {
        setIsDeleteDialogOpen(true)
      }
    },
    [activeAdminsCount],
  )

  const handleDeleteConfirm = useCallback(() => {
    setIsDeleteDialogOpen(false)

    if (simulateDeleteSuccess && currentAdmin) {
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== currentAdmin.id))

      toast({
        title: 'Administrador eliminado',
        description: 'El administrador ha sido eliminado correctamente.',
        variant: 'success',
      })
    } else {
      toast({
        title: 'Error al eliminar',
        description: 'No se pudo eliminar el administrador. Intente nuevamente.',
        variant: 'destructive',
      })
    }

    setCurrentAdmin(null)
  }, [currentAdmin, simulateDeleteSuccess, toast])

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
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.id}</TableCell>
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
            <AdministradorForm onSubmit={handleSuccess} />
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

      {/* Diálogo de seguridad para evitar eliminar cuando hay pocos administradores */}
      <AlertDialog open={isSecurityDialogOpen} onOpenChange={setIsSecurityDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No se puede eliminar el administrador</AlertDialogTitle>
            <AlertDialogDescription>
              Por razones de seguridad, no es posible eliminar este administrador. El sistema debe
              mantener al menos 2 administradores activos en todo momento.
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
