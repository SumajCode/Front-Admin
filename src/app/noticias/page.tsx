'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'
import * as React from 'react'
import noticiasData from '@/data/noticias.json'

interface Noticia {
  id: number
  title: string
  date: string
  content: string
}

export default React.memo(function NoticiasPage() {
  const [news, setNews] = useState<Noticia[]>([])

  // Cargar datos al montar el componente
  useEffect(() => {
    setNews(noticiasData.noticias)
  }, [])

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Noticias y Anuncios</h1>
        <Button className="flex items-center gap-2 bg-[#00bf7d] hover:bg-[#00bf7d]/90 text-white">
          <PlusCircle className="h-4 w-4" />
          Nueva Noticia
        </Button>
      </div>

      <div className="grid gap-6">
        {news.map((item) => (
          <Card key={item.id} className="border-[#0073e6]/20 hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-[#00bf7d]/5 to-transparent">
              <div className="flex justify-between items-start">
                <CardTitle>{item.title}</CardTitle>
                <span className="text-sm text-muted-foreground bg-[#5928ed]/10 px-2 py-1 rounded-full">
                  {item.date}
                </span>
              </div>
              <CardDescription>Anuncio para todos los docentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
})
