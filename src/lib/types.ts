export type {
  Administrador,
  AdministradorFormData,
  AdministradorStatus,
  AdministradorHistorial,
} from '@/types/administrador'
export type { Docente, DocenteFormData, DocenteStatus, DocenteHistorial } from '@/types/docente'
export type { Noticia, NoticiaFormData, NoticiaCategoria } from '@/types/noticia'

// Función helper para verificar si los Web Components están disponibles
export function isWebComponentDefined(tagName: string): boolean {
  return typeof window !== 'undefined' && !!customElements.get(tagName)
}

// Función para esperar a que un Web Component esté definido
export function waitForWebComponent(tagName: string, timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    if (isWebComponentDefined(tagName)) {
      resolve(true)
      return
    }

    const startTime = Date.now()
    const checkInterval = setInterval(() => {
      if (isWebComponentDefined(tagName)) {
        clearInterval(checkInterval)
        resolve(true)
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval)
        resolve(false)
      }
    }, 100)
  })
}
