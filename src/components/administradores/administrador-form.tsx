'use client'

import { useState, useCallback, useEffect } from 'react'
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
import type {
  AdministradorFormData,
  AdministradorEditFormData,
  Administrador,
} from '@/types/administrador'

const createFormSchema = z
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
    username: z
      .string()
      .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' })
      .max(20, { message: 'El nombre de usuario no puede exceder 20 caracteres.' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'El nombre de usuario solo puede contener letras, números y guiones bajos.',
      }),
    email: z.string().email({
      message: 'Ingrese un correo electrónico válido.',
    }),
    password: z
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número.',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

const editFormSchema = z.object({
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
  username: z
    .string()
    .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' })
    .max(20, { message: 'El nombre de usuario no puede exceder 20 caracteres.' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'El nombre de usuario solo puede contener letras, números y guiones bajos.',
    }),
  email: z.string().email({
    message: 'Ingrese un correo electrónico válido.',
  }),
})

interface AdministradorFormProps {
  onSubmit: (success: boolean, data?: AdministradorFormData | AdministradorEditFormData) => void
  administrador?: Administrador | null
  isEditMode?: boolean
}

export function AdministradorForm({
  onSubmit,
  administrador,
  isEditMode = false,
}: AdministradorFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Extraer nombre y apellido del nombre completo si estamos en modo edición
  const getNombreApellido = useCallback(() => {
    if (!administrador || !administrador.name) return { nombre: '', apellido: '' }

    const nameParts = administrador.name.split(' ')
    return {
      nombre: nameParts[0] || '',
      apellido: nameParts.slice(1).join(' ') || '',
    }
  }, [administrador])

  const { nombre, apellido } = getNombreApellido()

  const form = useForm<z.infer<typeof createFormSchema> | z.infer<typeof editFormSchema>>({
    resolver: zodResolver(isEditMode ? editFormSchema : createFormSchema),
    defaultValues: isEditMode
      ? {
          nombre: nombre,
          apellido: apellido,
          username: administrador?.username || '',
          email: administrador?.email || '',
        }
      : {
          nombre: '',
          apellido: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
  })

  // Actualizar el formulario cuando cambian los datos del administrador
  useEffect(() => {
    if (isEditMode && administrador) {
      const { nombre, apellido } = getNombreApellido()
      form.reset({
        nombre,
        apellido,
        username: administrador.username,
        email: administrador.email,
      })
    }
  }, [administrador, isEditMode, form, getNombreApellido])

  const handleSubmit = useCallback(
    (values: AdministradorFormData | AdministradorEditFormData) => {
      console.log('Form values:', values)
      onSubmit(true, values)
    },
    [onSubmit],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="carlos_mendoza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {!isEditMode && (
          <>
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
          </>
        )}

        <Button type="submit" className="w-full bg-[#00bf7d] hover:bg-[#00bf7d]/90 mt-4">
          {isEditMode ? 'Actualizar Administrador' : 'Guardar Administrador'}
        </Button>
      </form>
    </Form>
  )
}
