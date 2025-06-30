import { render, screen, waitFor } from '@testing-library/react'
import Layout from '@/layout/Layout'

jest.mock('@/utils/authUtils', () => ({
  initializeCrossDomainAuth: jest.fn(),
  isAuthenticated: jest.fn(),
  redirectToLogin: jest.fn(),
}))

const mockInitializeCrossDomainAuth = require('@/utils/authUtils').initializeCrossDomainAuth
const mockIsAuthenticated = require('@/utils/authUtils').isAuthenticated
const mockRedirectToLogin = require('@/utils/authUtils').redirectToLogin

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza el layout si está autenticado', async () => {
    mockInitializeCrossDomainAuth.mockReturnValue({ success: true })
    mockIsAuthenticated.mockReturnValue(true)

    render(
      <Layout>
        <div>Contenido protegido</div>
      </Layout>,
    )

    await waitFor(() => {
      expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
    })
  })
})
