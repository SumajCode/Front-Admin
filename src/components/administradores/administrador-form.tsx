'use client'

import { useState, useCallback } from 'react'
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
import type { AdministradorFormData } from '@/types/administrador'

const formSchema = z
  .object({
    nombre: z
      .string()
      .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, {
        message: 'El nombre solo debe contener letras y espacios.',
      }),
    apellido: z
      .string()
      .min(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, {
        message: 'El apellido solo debe contener letras y espacios.',
      }),
    email: z.string().email({
      message: 'Ingrese un correo electrónico válido.',
    }),
    password: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
        message:
          'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

interface AdministradorFormProps {
  onSubmit: (success: boolean) => void
}

export function AdministradorForm({ onSubmit }: AdministradorFormProps) {
  const [simulateSuccess, setSimulateSuccess] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = useCallback(
    (values: AdministradorFormData) => {
      console.log(values)
      setTimeout(() => onSubmit(simulateSuccess), 500)
    },
    [onSubmit, simulateSuccess],
  )

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
                  <Input placeholder="Carlos" {...field} />
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
                  <Input placeholder="Mendoza" {...field} />
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
                <Input placeholder="carlos.mendoza@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="********"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="********"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
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
            {simulateSuccess ? 'Simular operación exitosa' : 'Simular error de operación'}
          </label>
        </div>

        <Button type="submit" className="w-full bg-[#00bf7d] hover:bg-[#00bf7d]/90 mt-4">
          Guardar Administrador
        </Button>
      </form>
    </Form>
  )
}
