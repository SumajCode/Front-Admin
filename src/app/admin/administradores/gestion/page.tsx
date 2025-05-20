'use client'

import { useState, useCallback } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { AdministradorForm } from '@/components/administradores/administrador-form'
import type { Administrador } from '@/types/administrador'

// Mock data para administradores
const initialAdmins: Administrador[] = [
  {
    id: 1,
    name: 'Admin Principal',
    email: 'admin@gmail.com',
    status: 'Activo',
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@example.com',
    status: 'Activo',
  },
  {
    id: 4,
    name: 'Roberto Gómez',
    email: 'roberto.gomez@example.com',
    status: 'Activo',
  },
  {
    id: 5,
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    status: 'Inactivo',
  },
]

export default function GestionAdministradoresPage() {
  const [admins, setAdmins] = useState<Administrador[]>(initialAdmins)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

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
    </div>
  )
}
