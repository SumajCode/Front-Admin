import apiService from '@/services/apiService'

describe('ApiService', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('should have http methods', () => {
    expect(typeof apiService.get).toBe('function')
    expect(typeof apiService.post).toBe('function')
    expect(typeof apiService.put).toBe('function')
    expect(typeof apiService.delete).toBe('function')
  })

  it('calls authenticatedFetch for get', async () => {
    const fetchMock = jest
      .spyOn(apiService, 'authenticatedFetch')
      .mockResolvedValue({ ok: true } as Response)
    await apiService.get('/test')
    expect(fetchMock).toHaveBeenCalledWith('/test', { method: 'GET' })
    fetchMock.mockRestore()
  })

  it('calls authenticatedFetch for post', async () => {
    const fetchMock = jest
      .spyOn(apiService, 'authenticatedFetch')
      .mockResolvedValue({ ok: true } as Response)
    await apiService.post('/test', { foo: 'bar' })
    expect(fetchMock).toHaveBeenCalledWith('/test', {
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' }),
    })
    fetchMock.mockRestore()
  })

  it('calls authenticatedFetch for put', async () => {
    const fetchMock = jest
      .spyOn(apiService, 'authenticatedFetch')
      .mockResolvedValue({ ok: true } as Response)
    await apiService.put('/test', { foo: 'bar' })
    expect(fetchMock).toHaveBeenCalledWith('/test', {
      method: 'PUT',
      body: JSON.stringify({ foo: 'bar' }),
    })
    fetchMock.mockRestore()
  })

  it('calls authenticatedFetch for delete', async () => {
    const fetchMock = jest
      .spyOn(apiService, 'authenticatedFetch')
      .mockResolvedValue({ ok: true } as Response)
    await apiService.delete('/test')
    expect(fetchMock).toHaveBeenCalledWith('/test', { method: 'DELETE' })
    fetchMock.mockRestore()
  })
})
