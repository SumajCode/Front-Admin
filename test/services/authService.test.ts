import authService from '@/services/authService'

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('checkAuthentication retorna no autenticado por defecto', () => {
    const result = authService.checkAuthentication()
    expect(result.isAuthenticated).toBe(false)
    expect(result.user).toBeNull()
  })

  it('checkAuthentication retorna autenticado si hay datos válidos', () => {
    const user = {
      _id: '1',
      username: 'test',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'admin',
      is_active: true,
      created_at: '',
      updated_at: '',
    }
    localStorage.setItem('access_token', 'token')
    localStorage.setItem('user_data', JSON.stringify(user))
    localStorage.setItem('user_role', 'admin')
    const result = authService.checkAuthentication()
    expect(result.isAuthenticated).toBe(true)
    expect(result.user).toEqual(user)
  })

  it('getCurrentUser retorna null si no hay datos', () => {
    expect(authService.getCurrentUser()).toBeNull()
  })

  it('getCurrentUser retorna usuario si hay datos', () => {
    const user = {
      _id: '2',
      username: 'ana',
      email: 'ana@example.com',
      first_name: 'Ana',
      last_name: 'Gomez',
      role: 'admin',
      is_active: true,
      created_at: '',
      updated_at: '',
    }
    localStorage.setItem('user_data', JSON.stringify(user))
    expect(authService.getCurrentUser()).toEqual(user)
  })

  it('getAccessToken retorna null si no hay token', () => {
    expect(authService.getAccessToken()).toBeNull()
  })

  it('getAccessToken retorna token si existe', () => {
    localStorage.setItem('access_token', 'token123')
    expect(authService.getAccessToken()).toBe('token123')
  })

  it('isTokenValid retorna false si no hay token', () => {
    expect(authService.isTokenValid('')).toBe(false)
  })

  it('isTokenValid retorna false si el token es inválido', () => {
    expect(authService.isTokenValid('invalid.token.value')).toBe(false)
  })

  it('cleanupSession limpia localStorage y sessionStorage', () => {
    localStorage.setItem('access_token', 'token')
    sessionStorage.setItem('foo', 'bar')
    authService.cleanupSession()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(sessionStorage.getItem('foo')).toBeNull()
  })

  it('validateUserRole retorna true si el rol es admin', () => {
    const user = {
      _id: '3',
      username: 'admin',
      email: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      is_active: true,
      created_at: '',
      updated_at: '',
    }
    localStorage.setItem('user_data', JSON.stringify(user))
    localStorage.setItem('user_role', 'admin')
    expect(authService.validateUserRole('admin')).toBe(true)
  })

  it('validateUserRole retorna false si el rol no es admin', () => {
    const user = {
      _id: '4',
      username: 'user',
      email: 'user@example.com',
      first_name: 'User',
      last_name: 'Test',
      role: 'user',
      is_active: true,
      created_at: '',
      updated_at: '',
    }
    localStorage.setItem('user_data', JSON.stringify(user))
    localStorage.setItem('user_role', 'user')
    expect(authService.validateUserRole('admin')).toBe(false)
  })
})
