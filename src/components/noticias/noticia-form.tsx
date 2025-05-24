'use client'

import { useState, useEffect, useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { NoticiaFormData } from '@/types/noticia'
import categoriasData from '@/data/categorias.json'

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'El título debe tener al menos 5 caracteres.' })
    .max(100, { message: 'El título no puede exceder 100 caracteres.' }),
  content: z
    .string()
    .min(10, { message: 'El contenido debe tener al menos 10 caracteres.' })
    .max(1000, { message: 'El contenido no puede exceder 1000 caracteres.' }),
  categoria: z.string().min(1, { message: 'Seleccione una categoría.' }),
  fechaVencimiento: z.string().nullable().optional(),
  esPermanente: z.boolean(),
})

interface NoticiaFormProps {
  onSubmit: (success: boolean) => void
}

export function NoticiaForm({ onSubmit }: NoticiaFormProps) {
  const [simulateSuccess, setSimulateSuccess] = useState(true)
  const [categorias, setCategorias] = useState<string[]>([])

  // Cargar categorías al montar el componente
  useEffect(() => {
    setCategorias(categoriasData.categorias as string[])
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      categoria: '',
      fechaVencimiento: '',
      esPermanente: false,
    },
  })

  const esPermanente = form.watch('esPermanente')

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      const formData: NoticiaFormData = {
        title: values.title,
        content: values.content,
        categoria: values.categoria,
        fechaVencimiento: values.esPermanente ? null : values.fechaVencimiento || null,
      }

      console.log('Datos del formulario:', formData)
      setTimeout(() => onSubmit(simulateSuccess), 500)
    },
    [onSubmit, simulateSuccess],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título de la noticia</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Inicio del año académico 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escriba el contenido de la noticia..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="esPermanente"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Noticia permanente</FormLabel>
                <div className="text-sm text-muted-foreground">
                  La noticia no tendrá fecha de vencimiento
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {!esPermanente && (
          <FormField
            control={form.control}
            name="fechaVencimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de vencimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex items-center space-x-2 py-4">
          <Switch
            id="simulate-success"
            checked={simulateSuccess}
            onCheckedChange={setSimulateSuccess}
          />
          <label
            htmlFor="simulate-success"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {simulateSuccess ? 'Simular operación exitosa' : 'Simular error de operación'}
          </label>
        </div>

        <Button type="submit" className="w-full bg-[#00bf7d] hover:bg-[#00bf7d]/90 mt-4">
          Publicar Noticia
        </Button>
      </form>
    </Form>
  )
}
