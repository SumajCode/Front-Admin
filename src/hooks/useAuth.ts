'use client'

import { useState, useEffect } from 'react'
import authService from '@/services/authService'

interface User {
  _id: string
  first_name: string
  last_name: string
  email: string
  username?: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loadUserData = () => {
      try {
        const currentUser = authService.getCurrentUser()
        const authData = authService.checkAuthentication()
        const isAuth = authData.isAuthenticated

        console.log('🔐 useAuth: Loading user data...')
        console.log('🔐 useAuth: Current user:', currentUser)
        console.log('🔐 useAuth: Is authenticated:', isAuth)

        setUser(currentUser)
        setIsAuthenticated(isAuth)
      } catch (error) {
        console.error('❌ useAuth: Error loading user data:', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Cargar datos iniciales
    loadUserData()

    // Escuchar cambios en el localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'access_token' || event.key === 'user_data') {
        console.log('🔐 useAuth: Storage change detected, reloading user data')
        loadUserData()
      }
    }

    // Escuchar eventos personalizados de autenticación
    const handleUserAuthenticated = () => {
      console.log('🔐 useAuth: User authenticated event received')
      loadUserData()
    }

    const handleUserLoggedOut = () => {
      console.log('🔐 useAuth: User logged out event received')
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('user-authenticated', handleUserAuthenticated)
    window.addEventListener('userLoggedOut', handleUserLoggedOut)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('user-authenticated', handleUserAuthenticated)
      window.removeEventListener('userLoggedOut', handleUserLoggedOut)
    }
  }, [])

  const logout = async () => {
    try {
      const { logoutAndRedirect } = await import('@/utils/authUtils')
      await logoutAndRedirect()
    } catch (error) {
      console.error('❌ useAuth: Error during logout:', error)
    }
  }

  const refreshUser = () => {
    setIsLoading(true)
    const currentUser = authService.getCurrentUser()
    const authData = authService.checkAuthentication()
    const isAuth = authData.isAuthenticated

    setUser(currentUser)
    setIsAuthenticated(isAuth)
    setIsLoading(false)
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshUser,
  }
}
