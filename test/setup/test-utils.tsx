import type React from 'react'
import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'

// Wrapper personalizado para providers
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

export * from '@testing-library/react'
export { customRender as render }
