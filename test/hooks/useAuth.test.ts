import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'

jest.mock('@/services/authService', () => ({
  getCurrentUser: jest.fn(),
  checkAuthentication: jest.fn(),
}))

const mockGetCurrentUser = require('@/services/authService').getCurrentUser
const mockCheckAuthentication = require('@/services/authService').checkAuthentication

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCurrentUser.mockReturnValue(null)
    mockCheckAuthentication.mockReturnValue({ isAuthenticated: false })
  })

  it('devuelve usuario nulo y no autenticado por defecto', async () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('devuelve usuario y autenticación verdadera si está autenticado', async () => {
    const fakeUser = {
      _id: '1',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      role: 'admin',
      is_active: true,
      created_at: '',
      updated_at: '',
    }
    mockGetCurrentUser.mockReturnValue(fakeUser)
    mockCheckAuthentication.mockReturnValue({ isAuthenticated: true })

    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toEqual(fakeUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('actualiza usuario y autenticación al llamar refreshUser', async () => {
    const fakeUser = {
      _id: '2',
      first_name: 'Ana',
      last_name: 'Gomez',
      email: 'ana@example.com',
      role: 'admin',
      is_active: true,
      created_at: '',
      updated_at: '',
    }
    mockGetCurrentUser.mockReturnValue(fakeUser)
    mockCheckAuthentication.mockReturnValue({ isAuthenticated: true })

    const { result } = renderHook(() => useAuth())
    act(() => {
      result.current.refreshUser()
    })
    expect(result.current.user).toEqual(fakeUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })
})
