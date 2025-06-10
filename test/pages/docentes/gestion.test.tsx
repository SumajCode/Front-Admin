'use client'

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import DocentesPage from '@/app/docentes/gestion/page'

// Mock de los datos
jest.mock('@/data/docentes.json', () => ({
  docentes: [
    {
      id: 1,
      name: 'Docente Test',
      email: 'docente@test.com',
      facultades: ['Ingeniería', 'Ciencias'],
      status: 'Activo',
    },
    {
      id: 2,
      name: 'Docente Test 2',
      email: 'docente2@test.com',
      facultades: ['Derecho'],
      status: 'Inactivo',
    },
  ],
}))

// Mock del hook de toast
const toastMock = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}))

describe('DocentesPage', () => {
  beforeEach(() => {
    toastMock.mockClear()
  })

  it('renderiza el título de la página', () => {
    render(<DocentesPage />)
    expect(screen.getByText('Gestión de Docentes')).toBeInTheDocument()
  })

  it('renderiza los docentes en la tabla', async () => {
    render(<DocentesPage />)
    await waitFor(() => {
      expect(screen.getByText('Docente Test')).toBeInTheDocument()
      expect(screen.getByText('docente@test.com')).toBeInTheDocument()
    })
  })

  it('muestra todas las facultades y estados', async () => {
    render(<DocentesPage />)
    await waitFor(() => {
      expect(screen.getByText('Ingeniería')).toBeInTheDocument()
      expect(screen.getByText('Ciencias')).toBeInTheDocument()
      expect(screen.getByText('Derecho')).toBeInTheDocument()
      expect(screen.getByText('Activo')).toBeInTheDocument()
      expect(screen.getByText('Inactivo')).toBeInTheDocument()
    })
  })

  it('muestra el texto correcto del switch de simulación', async () => {
    render(<DocentesPage />)
    const deleteButtons = screen.getAllByText(
      (_, el) => el?.tagName === 'SPAN' && el.textContent === 'Eliminar',
    )
    fireEvent.click(deleteButtons[0])

    const switchToggle = await screen.findByRole('switch')
    expect(screen.getByText(/simular eliminación exitosa/i)).toBeInTheDocument()

    fireEvent.click(switchToggle)
    expect(screen.getByText(/simular error de eliminación/i)).toBeInTheDocument()
  })

  it('abre el formulario para nuevo docente', async () => {
    render(<DocentesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nuevo docente/i }))
    expect(await screen.findByRole('heading', { name: /nuevo docente/i })).toBeInTheDocument()
  })

  it('abre el formulario de edición con datos cargados', async () => {
    render(<DocentesPage />)
    const editButtons = screen.getAllByText(
      (_, el) => el?.tagName === 'SPAN' && el.textContent === 'Editar',
    )
    fireEvent.click(editButtons[0])
    expect(await screen.findByRole('heading', { name: /editar docente/i })).toBeInTheDocument()
  })

  it('muestra el diálogo de eliminación', async () => {
    render(<DocentesPage />)
    const deleteButtons = screen.getAllByText(
      (_, el) => el?.tagName === 'SPAN' && el.textContent === 'Eliminar',
    )
    fireEvent.click(deleteButtons[0])
    expect(
      await screen.findByRole('heading', { name: /está seguro de eliminar/i }),
    ).toBeInTheDocument()
  })

  it('simula eliminación exitosa y cierra el diálogo', async () => {
    render(<DocentesPage />)
    const deleteButtons = screen.getAllByText(
      (_, el) => el?.tagName === 'SPAN' && el.textContent === 'Eliminar',
    )
    fireEvent.click(deleteButtons[0])

    const confirmButton = await screen.findByRole('button', { name: /^eliminar$/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ title: expect.stringMatching(/eliminado/i) }),
      )
    })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('cancela eliminación y mantiene el diálogo cerrado', async () => {
    render(<DocentesPage />)
    const deleteButtons = screen.getAllByText(
      (_, el) => el?.tagName === 'SPAN' && el.textContent === 'Eliminar',
    )
    fireEvent.click(deleteButtons[0])

    const cancelButton = await screen.findByRole('button', { name: /^cancelar$/i })
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('cierra el formulario al presionar Escape', async () => {
    render(<DocentesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nuevo docente/i }))
    expect(await screen.findByRole('heading', { name: /nuevo docente/i })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /nuevo docente/i })).not.toBeInTheDocument()
    })
  })
})
