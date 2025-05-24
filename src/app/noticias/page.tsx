'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { PlusCircle, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { NoticiaForm } from '@/components/noticias/noticia-form'
import * as React from 'react'
import noticiasData from '@/data/noticias.json'
import type { Noticia } from '@/types/noticia'

// Función para verificar si una noticia está vencida
const isNoticiaVencida = (fechaVencimiento: string | null): boolean => {
  if (!fechaVencimiento) return false

  const [day, month, year] = fechaVencimiento.split('/').map(Number)
  const fechaVenc = new Date(year, month - 1, day)
  const hoy = new Date()

  return fechaVenc < hoy
}

// Función para obtener el color de la categoría
const getCategoriaColor = (categoria: string): string => {
  if (categoria === 'Universidad Mayor de San Simón') {
    return 'bg-[#2546f0]/20 text-[#2546f0]'
  }
  return 'bg-[#5928ed]/20 text-[#5928ed]'
}

export default React.memo(function NoticiasPage() {
  const [news, setNews] = useState<Noticia[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentNoticia, setCurrentNoticia] = useState<Noticia | null>(null)
  const { toast } = useToast()

  // Cargar datos al montar el componente
  useEffect(() => {
    const noticias = noticiasData.noticias as Noticia[]

    // Filtrar noticias activas y no vencidas
    const noticiasVisibles = noticias.filter((noticia) => {
      if (!noticia.activo) return false
      return !isNoticiaVencida(noticia.fechaVencimiento)
    })

    setNews(noticiasVisibles)
  }, [])

  const handleSuccess = useCallback(
    (success: boolean) => {
      setIsOpen(false)

      toast({
        title: success
          ? isEditMode
            ? 'Noticia actualizada'
            : 'Noticia publicada'
          : 'Error al procesar',
        description: success
          ? isEditMode
            ? 'La noticia ha sido actualizada correctamente.'
            : 'La noticia ha sido publicada correctamente.'
          : 'No se pudo procesar la noticia. Intente nuevamente.',
        variant: success ? 'success' : 'destructive',
      })

      if (success && !isEditMode) {
        // Simular la adición de una nueva noticia
        const newId = Math.max(...news.map((noticia) => noticia.id)) + 1
        const today = new Date()
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`

        setNews((prevNews) => [
          {
            id: newId,
            title: 'Nueva noticia publicada',
            date: formattedDate,
            content: 'Esta es una nueva noticia que ha sido publicada exitosamente.',
            categoria: 'Universidad Mayor de San Simón',
            fechaVencimiento: null,
            activo: true,
          },
          ...prevNews,
        ])
      }
    },
    [news, toast, isEditMode],
  )

  const handleNewNoticia = useCallback(() => {
    setIsEditMode(false)
    setCurrentNoticia(null)
    setIsOpen(true)
  }, [])

  const handleEditNoticia = useCallback((noticia: Noticia) => {
    setIsEditMode(true)
    setCurrentNoticia(noticia)
    setIsOpen(true)
  }, [])

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Noticias y Anuncios</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mantente informado sobre las últimas noticias de la universidad
          </p>
        </div>
        <Button
          className="flex items-center gap-2 bg-[#00bf7d] hover:bg-[#00bf7d]/90 text-white w-full sm:w-auto"
          onClick={handleNewNoticia}
        >
          <PlusCircle className="h-4 w-4" />
          Nueva Noticia
        </Button>
      </div>

      {news.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No hay noticias disponibles en este momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {news.map((item) => (
            <Card key={item.id} className="border-[#0073e6]/20 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-[#00bf7d]/5 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl">{item.title}</CardTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                      <Badge
                        variant="secondary"
                        className={`${getCategoriaColor(item.categoria)} text-xs w-fit`}
                      >
                        {item.categoria}
                      </Badge>
                      {item.fechaVencimiento && (
                        <span className="text-xs text-muted-foreground">
                          Válido hasta: {item.fechaVencimiento}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#0073e6] hover:bg-[#0073e6]/10 text-[#0073e6]"
                      onClick={() => handleEditNoticia(item)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only sm:ml-2">Editar</span>
                    </Button>
                    <span className="text-sm text-muted-foreground bg-[#5928ed]/10 px-3 py-1 rounded-full whitespace-nowrap">
                      {item.date}
                    </span>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  Anuncio para{' '}
                  {item.categoria === 'Universidad Mayor de San Simón'
                    ? 'toda la universidad'
                    : item.categoria}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm sm:text-base leading-relaxed">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle>{isEditMode ? 'Editar Noticia' : 'Nueva Noticia'}</SheetTitle>
            <SheetDescription>
              {isEditMode
                ? 'Modifique los datos de la noticia y guarde los cambios.'
                : 'Complete el formulario para publicar una nueva noticia o anuncio.'}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <NoticiaForm
              onSubmit={handleSuccess}
              noticia={currentNoticia}
              isEditMode={isEditMode}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
})
