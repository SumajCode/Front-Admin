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
import type { AdminFormData } from '@/types/admin'

const formSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' })
      .max(50, { message: 'El nombre de usuario no puede exceder 50 caracteres.' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'El nombre de usuario solo puede contener letras, números y guiones bajos.',
      }),
    first_name: z
      .string()
      .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
      .max(50, { message: 'El nombre no puede exceder 50 caracteres.' })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, {
        message: 'El nombre solo debe contener letras y espacios.',
      }),
    last_name: z
      .string()
      .min(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
      .max(50, { message: 'El apellido no puede exceder 50 caracteres.' })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, {
        message: 'El apellido solo debe contener letras y espacios.',
      }),
    email: z
      .string()
      .email({ message: 'Ingrese un correo electrónico válido.' })
      .max(100, { message: 'El email no puede exceder 100 caracteres.' }),
    password: z
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
      .max(100, { message: 'La contraseña no puede exceder 100 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

interface AdministradorFormProps {
  onSubmit: (data: AdminFormData) => Promise<void>
  isLoading?: boolean
}

export function AdministradorForm({ onSubmit, isLoading = false }: AdministradorFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = useCallback(
    async (values: AdminFormData) => {
      console.log('📝 AdministradorForm: Submitting form data')
      try {
        await onSubmit(values)
        console.log('✅ AdministradorForm: Form submitted successfully')
        form.reset()
      } catch (error) {
        console.error('❌ AdministradorForm: Error submitting form:', error)
      }
    },
    [onSubmit, form],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="admin123" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Carlos" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Mendoza" {...field} disabled={isLoading} />
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
                <Input
                  placeholder="carlos.mendoza@example.com"
                  type="email"
                  {...field}
                  disabled={isLoading}
                />
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
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
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
                    placeholder="••••••••"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#00bf7d] hover:bg-[#00bf7d]/90 mt-6"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar Administrador'}
        </Button>
      </form>
    </Form>
  )
}
