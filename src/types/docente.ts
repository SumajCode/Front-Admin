// Tipos para la API de docentes
export interface DocenteAPI {
  id: number
  nombre: string
  apellidos: string
  celular: number
  correo: string
  nacimiento: string
  usuario: string
  password: string
}

// Tipo para el docente en la UI
export interface Docente {
  id: number
  name: string
  email: string
  telefono?: string
  fechaNacimiento?: string
  usuario?: string
  status: "Activo" | "Inactivo"
}

// Tipo para los datos del formulario
export interface DocenteFormData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  fechaNacimiento: string
  usuario: string
  password?: string
  confirmPassword?: string
}

// Tipos para las requests de la API
export interface DocenteCreateRequest {
  nombre: string
  apellidos: string
  celular: string
  correo: string
  nacimiento: string
  usuario: string
  password: string
}

export interface DocenteUpdateRequest {
  id: string
  nombre: string
  apellidos: string
  celular: string
  correo: string
  nacimiento: string
  usuario: string
  password?: string
}

// Funciones helper para mapear entre API y UI
export function mapAPIToDocente(apiDocente: DocenteAPI): Docente {
  return {
    id: apiDocente.id,
    name: `${apiDocente.nombre} ${apiDocente.apellidos}`,
    email: apiDocente.correo,
    telefono: apiDocente.celular.toString(),
    fechaNacimiento: apiDocente.nacimiento,
    usuario: apiDocente.usuario,
    status: "Activo", // Por defecto, ya que la API no devuelve estado
  }
}

export function mapFormToAPICreate(formData: DocenteFormData): DocenteCreateRequest {
  return {
    nombre: formData.nombre,
    apellidos: formData.apellido,
    celular: formData.telefono,
    correo: formData.email,
    nacimiento: formData.fechaNacimiento,
    usuario: formData.usuario,
    password: formData.password || "",
  }
}

export function mapFormToAPIUpdate(formData: DocenteFormData, id: number): DocenteUpdateRequest {
  const updateData: DocenteUpdateRequest = {
    id: id.toString(),
    nombre: formData.nombre,
    apellidos: formData.apellido,
    celular: formData.telefono,
    correo: formData.email,
    nacimiento: formData.fechaNacimiento,
    usuario: formData.usuario,
  }

  // Solo incluir password si se proporcionó
  if (formData.password && formData.password.length > 0) {
    updateData.password = formData.password
  }

  return updateData
}

// Función para formatear fecha de la API (GMT) a formato DD/MM/YYYY
export function formatDateFromAPI(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch (error) {
    console.error("Error al formatear fecha:", error)
    return dateString
  }
}
