'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Filter } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import categoriasData from '@/data/categorias.json'

interface FiltrosNoticiasProps {
  categoriasSeleccionadas: string[]
  onCategoriasChange: (categorias: string[]) => void
}

export function FiltrosNoticias({
  categoriasSeleccionadas,
  onCategoriasChange,
}: FiltrosNoticiasProps) {
  const [categorias, setCategorias] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Cargar categorías al montar el componente
  useEffect(() => {
    setCategorias(categoriasData.categorias as string[])
  }, [])

  // Filtrar categorías basado en el término de búsqueda
  const filteredCategorias = categorias.filter((categoria) =>
    categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCategoriaToggle = (categoria: string) => {
    const newCategorias = categoriasSeleccionadas.includes(categoria)
      ? categoriasSeleccionadas.filter((c) => c !== categoria)
      : [...categoriasSeleccionadas, categoria]

    onCategoriasChange(newCategorias)
  }

  const handleRemoveCategoria = (categoria: string) => {
    onCategoriasChange(categoriasSeleccionadas.filter((c) => c !== categoria))
  }

  const handleClearAll = () => {
    onCategoriasChange([])
  }

  const handleSelectAll = () => {
    onCategoriasChange(categorias)
  }

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                Filtrar por Categorías
                {categoriasSeleccionadas.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {categoriasSeleccionadas.length}
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm">
                {isOpen ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Categorías seleccionadas */}
            {categoriasSeleccionadas.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Categorías seleccionadas:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-red-500 hover:text-red-700"
                  >
                    Limpiar todo
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoriasSeleccionadas.map((categoria) => (
                    <Badge
                      key={categoria}
                      variant="secondary"
                      className="text-xs bg-[#00bf7d]/20 text-[#00bf7d] pr-1"
                    >
                      {categoria}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2 hover:bg-transparent"
                        onClick={() => handleRemoveCategoria(categoria)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Buscador y controles */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Buscar categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="whitespace-nowrap"
                  >
                    Seleccionar todo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="whitespace-nowrap"
                  >
                    Limpiar
                  </Button>
                </div>
              </div>

              {/* Lista de categorías */}
              <ScrollArea className="h-60 rounded-md border p-4">
                <div className="space-y-3">
                  {filteredCategorias.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No se encontraron categorías
                    </p>
                  ) : (
                    filteredCategorias.map((categoria) => (
                      <div key={categoria} className="flex items-center space-x-3">
                        <Checkbox
                          id={categoria}
                          checked={categoriasSeleccionadas.includes(categoria)}
                          onCheckedChange={() => handleCategoriaToggle(categoria)}
                        />
                        <label
                          htmlFor={categoria}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {categoria}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
