export interface AdminData {
  _id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: "admin" | "docente" | "estudiante"
  is_active: boolean
  created_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  admin_data: AdminData
}

export interface AuthContextType {
  user: AdminData | null
  login: (email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  checkAuth: () => Promise<void>
}
