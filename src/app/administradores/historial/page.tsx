'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AdministradorHistorial } from '@/types/administrador'
import historialData from '@/data/administradores-historial.json'

// Función para convertir fecha en formato DD/MM/YYYY a objeto Date para ordenar
const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split('/').map(Number)
  return new Date(year, month - 1, day)
}

export default function HistorialAdministradoresPage() {
  const [adminHistory, setAdminHistory] = useState<AdministradorHistorial[]>([])

  // Cargar datos al montar el componente
  useEffect(() => {
    setAdminHistory(historialData.historial as AdministradorHistorial[])
  }, [])

  // Ordenar los registros por fecha descendente (más recientes primero)
  const sortedHistory = [...adminHistory].sort((a, b) => {
    return parseDate(b.date).getTime() - parseDate(a.date).getTime()
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Historial de Administradores</h1>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividades</CardTitle>
          <CardDescription>
            Historial de todas las acciones realizadas sobre los administradores del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHistory.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.action === 'Creación'
                          ? 'bg-[#00bf7d]/20 text-[#00bf7d]'
                          : record.action === 'Edición'
                            ? 'bg-[#0073e6]/20 text-[#0073e6]'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.action}
                    </span>
                  </TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
