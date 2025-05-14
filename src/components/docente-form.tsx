'use client'

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  apellido: z.string().min(2, {
    message: 'El apellido debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Ingrese un correo electrónico válido.',
  }),
  telefono: z.string().min(8, {
    message: 'Ingrese un número de célular válido.',
  }),
  departamento: z.string({
    required_error: 'Seleccione un departamento.',
  }),
})

export function DocenteForm({ onSubmit }: { onSubmit: (success: boolean) => void }) {
  const [simulateSuccess, setSimulateSuccess] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      departamento: '',
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    // Simulamos el envío del formulario
    console.log(values)

    // Llamamos a la función onSubmit con el valor del interruptor
    setTimeout(() => {
      onSubmit(simulateSuccess)
    }, 500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="juan.perez@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Célular</FormLabel>
              <FormControl>
                <Input placeholder="60436897" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un departamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ciencias_politicas">Ciencias Políticas</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
            {simulateSuccess ? 'Simular registro exitoso' : 'Simular error de registro'}
          </label>
        </div>

        <Button type="submit" className="w-full bg-[#00bf7d] hover:bg-[#00bf7d]/90 mt-4">
          Guardar Docente
        </Button>
      </form>
    </Form>
  )
}
