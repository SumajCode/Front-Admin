"use client"

import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { X, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Docente, DocenteFormData } from "@/types/docente"
import React from "react"
import facultadesData from "@/data/facultades.json"

const formSchema = z
  .object({
    nombre: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, {
        message: "El nombre solo debe contener letras y espacios.",
      }),
    apellido: z
      .string()
      .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, {
        message: "El apellido solo debe contener letras y espacios.",
      }),
    email: z.string().email({
      message: "Ingrese un correo electrónico válido.",
    }),
    telefono: z
      .string()
      .min(8, { message: "Ingrese un número de célular válido." })
      .max(8, { message: "El número de teléfono debe tener exactamente 8 dígitos." })
      .regex(/^[0-9]+$/, {
        message: "El teléfono solo debe contener números.",
      }),
    fechaNacimiento: z
      .string()
      .min(1, { message: "La fecha de nacimiento es requerida." })
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
        message: "Formato de fecha inválido. Use DD/MM/YYYY.",
      }),
    usuario: z
      .string()
      .min(3, { message: "El usuario debe tener al menos 3 caracteres." })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "El usuario solo puede contener letras, números y guiones bajos.",
      }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
    confirmPassword: z.string().min(6, { message: "Confirme la contraseña." }),
    facultades: z.array(z.string()).min(1, {
      message: "Seleccione al menos una facultad.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

interface DocenteFormProps {
  onSubmit: (formData: DocenteFormData) => void | Promise<void>
  docente?: Docente | null
  isEditMode?: boolean
}

export function DocenteForm({ onSubmit, docente, isEditMode = false }: DocenteFormProps) {
  const [simulateSuccess, setSimulateSuccess] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [facultades, setFacultades] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Cargar facultades al montar el componente
  useEffect(() => {
    setFacultades(facultadesData.facultades as string[])
  }, [])

  // Extraer nombre y apellido del nombre completo si estamos en modo edición
  const getNombreApellido = useCallback(() => {
    if (!docente || !docente.name) return { nombre: "", apellido: "" }

    const nameParts = docente.name.split(" ")
    return {
      nombre: nameParts[0] || "",
      apellido: nameParts.slice(1).join(" ") || "",
    }
  }, [docente])

  const { nombre, apellido } = getNombreApellido()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: isEditMode ? nombre : "",
      apellido: isEditMode ? apellido : "",
      email: isEditMode && docente ? docente.email : "",
      telefono: isEditMode && docente?.telefono ? docente.telefono : "",
      fechaNacimiento: isEditMode && docente?.fechaNacimiento ? docente.fechaNacimiento : "",
      usuario: isEditMode && docente?.usuario ? docente.usuario : "",
      password: "",
      confirmPassword: "",
      facultades: isEditMode && docente ? docente.facultades : [],
    },
  })

  // Actualizar el formulario cuando cambian los datos del docente
  useEffect(() => {
    if (isEditMode && docente) {
      const { nombre, apellido } = getNombreApellido()
      form.reset({
        nombre,
        apellido,
        email: docente.email,
        telefono: docente.telefono || "",
        fechaNacimiento: docente.fechaNacimiento || "",
        usuario: docente.usuario || "",
        password: "",
        confirmPassword: "",
        facultades: docente.facultades,
      })
    }
  }, [docente, isEditMode, form, getNombreApellido])

  const handleSubmit = useCallback(
    (values: DocenteFormData) => {
      console.log("Datos del formulario:", values)
      onSubmit(values) // ya no necesita 'simulateSuccess'
    },
    [onSubmit]
  )

  // Filtrar facultades basado en el término de búsqueda
  const filteredFacultades = React.useMemo(
    () => facultades.filter((facultad) => facultad.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm, facultades],
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            name="fechaNacimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <FormControl>
                  <Input placeholder="15/10/2000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="usuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input placeholder="juan_perez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isEditMode ? "Nueva Contraseña (opcional)" : "Contraseña"}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="••••••••" type={showPassword ? "text" : "password"} {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="••••••••" type={showConfirmPassword ? "text" : "password"} {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="facultades"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Facultades</FormLabel>
              <FormMessage />

              <div className="border rounded-md p-4">
                <Input
                  placeholder="Buscar facultades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />

                <ScrollArea className="h-60 rounded-md border">
                  <div className="p-4 space-y-2">
                    {filteredFacultades.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No se encontraron facultades</p>
                    ) : (
                      filteredFacultades.map((facultad) => (
                        <div key={facultad} className="flex items-center space-x-2">
                          <Checkbox
                            id={facultad}
                            checked={field.value?.includes(facultad)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || []
                              const newValues = checked
                                ? [...currentValues, facultad]
                                : currentValues.filter((value) => value !== facultad)

                              form.setValue("facultades", newValues, { shouldValidate: true })
                            }}
                          />
                          <label
                            htmlFor={facultad}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {facultad}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {field.value.map((facultad) => (
                    <Badge key={facultad} variant="secondary" className="text-xs">
                      {facultad}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2"
                        onClick={() => {
                          const newValues = field.value.filter((value) => value !== facultad)
                          form.setValue("facultades", newValues, { shouldValidate: true })
                        }}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2 py-4">
          <Switch id="simulate-success" checked={simulateSuccess} onCheckedChange={setSimulateSuccess} />
          <label
            htmlFor="simulate-success"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {simulateSuccess ? "Simular operación exitosa" : "Simular error de operación"}
          </label>
        </div>

        <Button type="submit" className="w-full bg-[#00bf7d] hover:bg-[#00bf7d]/90 mt-4">
          {isEditMode ? "Actualizar Docente" : "Guardar Docente"}
        </Button>
      </form>
    </Form>
  )
}
