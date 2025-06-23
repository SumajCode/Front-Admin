'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Por ahora mantenemos datos estáticos para el historial
// hasta que se implemente el sistema de auditoría en el backend
const historialData = [
  {
    id: 1,
    admin_id: '6855eab16304b135ac180362',
    action: 'Creación',
    date: '20/06/2025',
    user: 'sistema@admin.com',
    details: 'Administrador creado desde el sistema',
  },
  {
    id: 2,
    admin_id: '6855edd890b7de2f431053f',
    action: 'Creación',
    date: '20/06/2025',
    user: 'admin@admin.com',
    details: 'Administrador creado manualmente',
  },
]

export default function HistorialAdministradoresPage() {
  const [adminHistory, setAdminHistory] = useState(historialData)
  const [isLoading, setIsLoading] = useState(false)

  // Función para convertir fecha en formato DD/MM/YYYY a objeto Date para ordenar
  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  // Ordenar los registros por fecha descendente (más recientes primero)
  const sortedHistory = [...adminHistory].sort((a, b) => {
    return parseDate(b.date).getTime() - parseDate(a.date).getTime()
  })

  // TODO: Implementar cuando el backend tenga sistema de auditoría
  // useEffect(() => {
  //   const loadHistory = async () => {
  //     setIsLoading(true)
  //     try {
  //       // const history = await adminService.getAdminHistory()
  //       // setAdminHistory(history)
  //     } catch (error) {
  //       console.error('Error loading admin history:', error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   loadHistory()
  // }, [])

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
      <div>
        <h1 className="text-3xl font-bold mb-2">Historial de Administradores</h1>
        <p className="text-muted-foreground mb-6">
          Registro de todas las acciones realizadas sobre los administradores del sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividades</CardTitle>
          <CardDescription>
            Historial de todas las acciones realizadas sobre los administradores del sistema.
            {/* TODO: Mostrar información cuando se implemente el sistema de auditoría */}
            <br />
            <span className="text-orange-600 text-xs">
              ⚠️ Datos de ejemplo - Sistema de auditoría en desarrollo
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>ID Administrador</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHistory.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-mono text-xs">{record.admin_id}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.action === 'Creación'
                          ? 'bg-[#00bf7d]/20 text-[#00bf7d]'
                          : record.action === 'Edición'
                            ? 'bg-[#0073e6]/20 text-[#0073e6]'
                            : record.action === 'Activación'
                              ? 'bg-green-100 text-green-800'
                              : record.action === 'Desactivación'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.action}
                    </span>
                  </TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.user}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
