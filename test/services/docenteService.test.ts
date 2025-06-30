import { docenteService } from '@/services/docenteService'

global.fetch = jest.fn()

describe('docenteService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('getAllDocentes returns data on success', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ id: 1, nombre: 'Docente' }], message: '', status: 200 }),
    })
    const result = await docenteService.getAllDocentes()
    expect(result).toEqual([{ id: 1, nombre: 'Docente' }])
  })

  it('getAllDocentes throws on error', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => 'error',
      status: 500,
    })
    await expect(docenteService.getAllDocentes()).rejects.toThrow('Error 500: error')
  })

  it('getDocenteById returns docente on success', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ id: 2, nombre: 'Docente2' }], message: '', status: 200 }),
    })
    const result = await docenteService.getDocenteById(2)
    expect(result).toEqual({ id: 2, nombre: 'Docente2' })
  })

  it('getDocenteById throws if not found', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], message: '', status: 200 }),
    })
    await expect(docenteService.getDocenteById(99)).rejects.toThrow('Docente no encontrado')
  })

  it('createDocente calls fetch and resolves on success', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], message: '', status: 200 }),
    })
    await expect(docenteService.createDocente({ nombre: 'Nuevo' } as any)).resolves.toBeUndefined()
  })

  it('createDocente throws on error', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => 'error',
      status: 400,
    })
    await expect(docenteService.createDocente({ nombre: 'Nuevo' } as any)).rejects.toThrow(
      'Error 400: error',
    )
  })

  it('updateDocente calls fetch and resolves on success', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], message: '', status: 200 }),
    })
    await expect(
      docenteService.updateDocente({ id: 1, nombre: 'Editado' } as any),
    ).resolves.toBeUndefined()
  })

  it('updateDocente throws on error', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => 'error',
      status: 400,
    })
    await expect(docenteService.updateDocente({ id: 1, nombre: 'Editado' } as any)).rejects.toThrow(
      'Error 400: error',
    )
  })
})
