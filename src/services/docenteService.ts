import type { DocenteAPI, DocenteCreateRequest, DocenteUpdateRequest } from "@/types/docente"

const API_BASE_URL = "https://microservice-docente.onrender.com/apidocentes/v1/docente"

// Función helper para obtener headers con autenticación
function getAuthHeaders(): HeadersInit {
  const accessToken = localStorage.getItem("access_token")

  return {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  }
}

// Función helper para manejar respuestas de la API
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`❌ Error ${response.status}:`, errorText)
    throw new Error(`Error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  console.log("✅ Respuesta exitosa:", data)
  return data
}

export const docenteService = {
  // Obtener todos los docentes
  async getAllDocentes(): Promise<DocenteAPI[]> {
    console.log("📡 Obteniendo todos los docentes...")

    try {
      const response = await fetch(`${API_BASE_URL}/listar`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      const result = await handleResponse<{ data: DocenteAPI[]; message: string; status: number }>(response)

      if (result.data && Array.isArray(result.data)) {
        console.log(`✅ ${result.data.length} docentes obtenidos exitosamente`)
        return result.data
      } else {
        console.warn("⚠️ Formato de respuesta inesperado:", result)
        return []
      }
    } catch (error) {
      console.error("❌ Error al obtener docentes:", error)
      throw error
    }
  },

  // Obtener un docente por ID
  async getDocenteById(id: number): Promise<DocenteAPI> {
    console.log(`📡 Obteniendo docente con ID: ${id}`)

    try {
      const response = await fetch(`${API_BASE_URL}/listar/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      const result = await handleResponse<{ data: DocenteAPI[]; message: string; status: number }>(response)

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        console.log("✅ Docente obtenido exitosamente:", result.data[0])
        return result.data[0]
      } else {
        throw new Error("Docente no encontrado")
      }
    } catch (error) {
      console.error(`❌ Error al obtener docente ${id}:`, error)
      throw error
    }
  },

  // Crear un nuevo docente
  async createDocente(docenteData: DocenteCreateRequest): Promise<void> {
    console.log("📡 Creando nuevo docente:", docenteData)

    try {
      const response = await fetch(`${API_BASE_URL}/crear`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(docenteData),
      })

      await handleResponse<{ data: any[]; message: string; status: number }>(response)
      console.log("✅ Docente creado exitosamente")
    } catch (error) {
      console.error("❌ Error al crear docente:", error)
      throw error
    }
  },

  // Actualizar un docente existente
  async updateDocente(docenteData: DocenteUpdateRequest): Promise<void> {
    console.log("📡 Actualizando docente:", docenteData)

    try {
      const response = await fetch(`${API_BASE_URL}/editar`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(docenteData),
      })

      await handleResponse<{ data: any[]; message: string; status: number }>(response)
      console.log("✅ Docente actualizado exitosamente")
    } catch (error) {
      console.error("❌ Error al actualizar docente:", error)
      throw error
    }
  },
}
