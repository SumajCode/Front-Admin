"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { AdministradorHistorial } from "@/types/administrador"
import { formatHistoryForDisplay } from "@/types/administrador"
import adminService from "@/services/adminService"

export default function HistorialAdministradoresPage() {
  const [adminHistory, setAdminHistory] = useState<AdministradorHistorial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Cargar historial al montar el componente
  const loadHistory = useCallback(async () => {
    console.log("📋 HistorialAdmins: Loading admin history...")
    setIsLoading(true)

    try {
      const historyData = await adminService.getAdminHistory()
      console.log("✅ HistorialAdmins: History loaded:", historyData.length)
      setAdminHistory(historyData)
    } catch (error) {
      console.error("❌ HistorialAdmins: Error loading history:", error)
      toast({
        title: "Error al cargar historial",
        description: "No se pudo cargar el historial de administradores. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // Ordenar los registros por fecha descendente (más recientes primero)
  const sortedHistory = [...adminHistory].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

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
      <h1 className="text-3xl font-bold mb-6">Historial de Administradores</h1>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividades</CardTitle>
          <CardDescription>
            Historial de todas las acciones realizadas sobre los administradores del sistema.
            {sortedHistory.length > 0 && (
              <span className="block mt-1 text-sm text-[#00bf7d]">Total de registros: {sortedHistory.length}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay registros de historial disponibles.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>ID Administrador</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Realizado por</TableHead>
                  <TableHead>Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.map((record, index) => {
                  const displayRecord = formatHistoryForDisplay(record)

                  return (
                    <TableRow key={record._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">{record.admin_id}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.action === "create"
                              ? "bg-[#00bf7d]/20 text-[#00bf7d]"
                              : record.action === "update"
                                ? "bg-[#0073e6]/20 text-[#0073e6]"
                                : record.action === "delete"
                                  ? "bg-red-100 text-red-800"
                                  : record.action === "activate"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {displayRecord.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{displayRecord.date}</div>
                          <div className="text-muted-foreground">
                            {new Date(record.timestamp).toLocaleTimeString("es-ES")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.performed_by}</TableCell>
                      <TableCell>
                        {record.details && Object.keys(record.details).length > 0 ? (
                          <div className="text-xs text-muted-foreground max-w-xs">
                            {Object.entries(record.details).map(([key, value]) => (
                              <div key={key}>
                                <strong>{key}:</strong> {String(value)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Sin detalles</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
