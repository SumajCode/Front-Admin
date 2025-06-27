import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import DocentesPage from '@/app/docentes/gestion/page'

jest.mock('@/services/docenteService', () => ({
  docenteService: {
    getAllDocentes: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: 'Docente Test',
        email: 'docente@test.com',
        telefono: '123456',
        usuario: 'dtest',
        status: 'Activo',
      },
      {
        id: 2,
        name: 'Docente Test 2',
        email: 'docente2@test.com',
        telefono: '654321',
        usuario: 'dtest2',
        status: 'Inactivo',
      },
    ]),
    createDocente: jest.fn().mockResolvedValue({}),
    updateDocente: jest.fn().mockResolvedValue({}),
  },
}))

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

  it('renderiza el título de la página', async () => {
    render(<DocentesPage />)
    await waitFor(() => expect(screen.getByText('Gestión de Docentes')).toBeInTheDocument())
  })

  it('abre el formulario para nuevo docente', async () => {
    render(<DocentesPage />)
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /nuevo docente/i })).toBeEnabled(),
    )
    fireEvent.click(screen.getByRole('button', { name: /nuevo docente/i }))
    // Usa findAllByText para tolerar múltiples coincidencias (heading y botón)
    const headings = await screen.findAllByText((content) => /nuevo docente/i.test(content))
    expect(headings.length).toBeGreaterThan(0)
  })
})
