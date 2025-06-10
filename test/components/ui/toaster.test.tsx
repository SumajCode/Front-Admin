'use client'

import { render, screen } from '@testing-library/react'
import { Toaster } from '@/components/ui/toaster'

// Simula una implementación de useToast con toasts de prueba
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toasts: [
      {
        id: '1',
        title: 'Toast de prueba',
        description: 'Este es un mensaje de prueba',
        action: <button>Acción</button>,
      },
    ],
  }),
}))

describe('Toaster', () => {
  it('renderiza el toast con título y descripción', () => {
    render(<Toaster />)

    expect(screen.getByText('Toast de prueba')).toBeInTheDocument()
    expect(screen.getByText('Este es un mensaje de prueba')).toBeInTheDocument()
  })

  it('renderiza el botón de acción si está presente', () => {
    render(<Toaster />)

    expect(screen.getByRole('button', { name: 'Acción' })).toBeInTheDocument()
  })
})
