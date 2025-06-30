import adminService from '@/services/adminService'

jest.mock('@/services/apiService', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}))
const apiService = require('@/services/apiService')

describe('adminService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getAllAdmins retorna lista de admins', async () => {
    apiService.get.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          admins: [
            {
              _id: '1',
              username: 'admin',
              email: 'a@a.com',
              first_name: 'A',
              last_name: 'B',
              role: 'admin',
              is_active: true,
              created_at: '',
            },
          ],
        },
        message: '',
      }),
    })
    const result = await adminService.getAllAdmins()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0].username).toBe('admin')
  })

  it('getAdminById retorna un admin', async () => {
    apiService.get.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          _id: '1',
          username: 'admin',
          email: 'a@a.com',
          first_name: 'A',
          last_name: 'B',
          role: 'admin',
          is_active: true,
          created_at: '',
        },
        message: '',
      }),
    })
    const result = await adminService.getAdminById('1')
    expect(result.username).toBe('admin')
  })

  it('createAdmin retorna el admin creado', async () => {
    apiService.post.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        data: {
          _id: '2',
          username: 'nuevo',
          email: 'nuevo@a.com',
          first_name: 'Nuevo',
          last_name: 'Admin',
          role: 'admin',
          is_active: true,
          created_at: '',
        },
        message: '',
      }),
    })
    const result = await adminService.createAdmin({
      username: 'nuevo',
      email: 'nuevo@a.com',
      password: '123',
      first_name: 'Nuevo',
      last_name: 'Admin',
      role: 'admin',
    })
    expect(result.username).toBe('nuevo')
  })

  it('updateAdmin retorna el admin actualizado', async () => {
    apiService.put.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          _id: '1',
          username: 'actualizado',
          email: 'a@a.com',
          first_name: 'A',
          last_name: 'B',
          role: 'admin',
          is_active: true,
          created_at: '',
        },
        message: '',
      }),
    })
    const result = await adminService.updateAdmin('1', { username: 'actualizado' })
    expect(result.username).toBe('actualizado')
  })

  it('deleteAdmin no lanza error si la respuesta es success', async () => {
    apiService.delete.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: null, message: '' }),
    })
    await expect(adminService.deleteAdmin('1')).resolves.toBeUndefined()
  })

  it('toggleAdminStatus llama updateAdmin y retorna admin', async () => {
    const admin = {
      _id: '1',
      username: 'admin',
      email: 'a@a.com',
      first_name: 'A',
      last_name: 'B',
      role: 'admin',
      is_active: false,
      created_at: '',
    }
    adminService.updateAdmin = jest.fn().mockResolvedValue(admin)
    const result = await adminService.toggleAdminStatus('1', false)
    expect(result).toEqual(admin)
  })
})
