import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'

// Mock data for news
const news = [
  {
    id: 1,
    title: 'Inicio del año académico',
    date: '01/03/2023',
    content:
      'El inicio del año académico será el 15 de marzo. Todos los docentes deben presentarse el 10 de marzo para la reunión de planificación.',
  },
  {
    id: 2,
    title: 'Capacitación docente',
    date: '15/02/2023',
    content:
      'Se realizará una capacitación docente sobre nuevas metodologías de enseñanza el 20 de febrero. La asistencia es obligatoria.',
  },
  {
    id: 3,
    title: 'Actualización de plataforma educativa',
    date: '10/01/2023',
    content:
      'Se ha actualizado la plataforma educativa. Se recomienda a todos los docentes familiarizarse con las nuevas funcionalidades.',
  },
]

export default function NoticiasPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Noticias y Anuncios</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Nueva Noticia
        </Button>
      </div>

      <div className="grid gap-6">
        {news.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{item.title}</CardTitle>
                <span className="text-sm text-muted-foreground">{item.date}</span>
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
}
