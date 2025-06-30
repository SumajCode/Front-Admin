import * as authUtils from '@/utils/authUtils'

describe('authUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('getCurrentUser retorna null si no hay datos', () => {
    expect(authUtils.getCurrentUser()).toBeNull()
  })

  it('getCurrentUser retorna usuario si hay datos', () => {
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
    localStorage.setItem('user_data', JSON.stringify(user))
    expect(authUtils.getCurrentUser()).toEqual(user)
  })

  it('isAuthenticated retorna false si no hay datos', () => {
    expect(authUtils.isAuthenticated()).toBe(false)
  })

  it('isAuthenticated retorna true si hay datos válidos', () => {
    localStorage.setItem('access_token', 'token')
    localStorage.setItem('user_data', JSON.stringify({ role: 'admin' }))
    localStorage.setItem('user_role', 'admin')
    expect(authUtils.isAuthenticated()).toBe(true)
  })

  it('clearAuthData limpia localStorage y sessionStorage', () => {
    localStorage.setItem('access_token', 'token')
    sessionStorage.setItem('foo', 'bar')
    authUtils.clearAuthData()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(sessionStorage.getItem('foo')).toBeNull()
  })

  it('getEnvironmentInfo retorna info de entorno', () => {
    const info = authUtils.getEnvironmentInfo()
    expect(info).toHaveProperty('environment')
    expect(info).toHaveProperty('loginUrl')
    expect(info).toHaveProperty('isLocalhost')
  })

  it('initializeCrossDomainAuth retorna success false si no hay datos', () => {
    const result = authUtils.initializeCrossDomainAuth()
    expect(result.success).toBe(false)
  })
})
