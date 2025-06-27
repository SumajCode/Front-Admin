// Servicio para la gestión de docentes con la API
const API_BASE_URL = "https://microservice-docente.onrender.com/apidocentes/v1/docente"

// Función para obtener el token de autorización
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

// Función para obtener headers con autorización
const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export interface DocenteAPI {
  id: number
  nombre: string
  apellidos: string
  celular: number
  correo: string
  nacimiento: string
  usuario: string
  password?: string
}

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
  nombre?: string
  apellidos?: string
  celular?: string
  correo?: string
  nacimiento?: string
  usuario?: string
  password?: string
}

export interface APIResponse<T> {
  data: T
  message: string
  status: number
}

class DocenteService {
  // Obtener todos los docentes
  async getAllDocentes(): Promise<DocenteAPI[]> {
    try {
      console.log("🔄 Obteniendo lista de docentes...")

      const response = await fetch(`${API_BASE_URL}/listar`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result: APIResponse<DocenteAPI[]> = await response.json()
      console.log("✅ Docentes obtenidos exitosamente:", result.data?.length || 0)

      return result.data || []
    } catch (error) {
      console.error("❌ Error al obtener docentes:", error)
      throw new Error("No se pudieron cargar los docentes")
    }
  }

  // Obtener un docente específico por ID
  async getDocenteById(id: string): Promise<DocenteAPI> {
    try {
      console.log("🔄 Obteniendo docente por ID:", id)

      const response = await fetch(`${API_BASE_URL}/listar/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result: APIResponse<DocenteAPI[]> = await response.json()
      console.log("✅ Docente obtenido exitosamente:", result.data[0])

      if (!result.data || result.data.length === 0) {
        throw new Error("Docente no encontrado")
      }

      return result.data[0]
    } catch (error) {
      console.error("❌ Error al obtener docente:", error)
      throw error
    }
  }

  // Crear un nuevo docente
  async createDocente(docenteData: DocenteCreateRequest): Promise<void> {
    try {
      console.log("🔄 Creando nuevo docente...", docenteData)

      const response = await fetch(`${API_BASE_URL}/crear`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(docenteData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error HTTP: ${response.status}`)
      }

      const result: APIResponse<any> = await response.json()
      console.log("✅ Docente creado exitosamente:", result.message)
    } catch (error) {
      console.error("❌ Error al crear docente:", error)
      throw error
    }
  }

  // Actualizar un docente existente
  async updateDocente(docenteData: DocenteUpdateRequest): Promise<void> {
    try {
      console.log("🔄 Actualizando docente...", docenteData)

      const response = await fetch(`${API_BASE_URL}/editar`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(docenteData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error HTTP: ${response.status}`)
      }

      const result: APIResponse<any> = await response.json()
      console.log("✅ Docente actualizado exitosamente:", result.message)
    } catch (error) {
      console.error("❌ Error al actualizar docente:", error)
      throw error
    }
  }
}

export const docenteService = new DocenteService()
