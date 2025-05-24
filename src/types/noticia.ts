export interface Noticia {
  id: number
  title: string
  date: string
  content: string
  categoria: string
  fechaVencimiento: string | null
  activo: boolean
}

export interface NoticiaFormData {
  title: string
  content: string
  categoria: string
  fechaVencimiento: string | null
}

export type NoticiaCategoria = string
