import type React from 'react'
import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {children}
      <Toaster />
    </SidebarProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Mock data generators
export const generateMockAdministrador = (overrides = {}) => ({
  id: 1,
  name: 'Test Admin',
  email: 'admin@test.com',
  status: 'Activo' as const,
  ...overrides,
})

export const generateMockDocente = (overrides = {}) => ({
  id: 1,
  name: 'Test Docente',
  email: 'docente@test.com',
  telefono: '12345678',
  facultades: ['Facultad de Ciencias y Tecnología'],
  status: 'Activo' as const,
  ...overrides,
})

export const generateMockNoticia = (overrides = {}) => ({
  id: 1,
  title: 'Test Noticia',
  date: '01/01/2024',
  content: 'Test content',
  categoria: 'Universidad Mayor de San Simón',
  fechaVencimiento: null,
  activo: true,
  ...overrides,
})

// Wait for async operations
export const waitForLoadingToFinish = () => new Promise((resolve) => setTimeout(resolve, 0))

// Mock form submission
export const mockFormSubmission = (success = true) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(success), 100)
  })
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { customRender as render }
