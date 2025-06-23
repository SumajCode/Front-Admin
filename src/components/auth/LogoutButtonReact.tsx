'use client'

import React from 'react'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  text?: string
  className?: string
  showIcon?: boolean
  confirm?: boolean
  style?: React.CSSProperties
  onBeforeLogout?: () => void
  onLogoutComplete?: () => void
  onLogoutError?: (error: string) => void
}

export function LogoutButtonReact({
  text = 'Cerrar Sesión',
  className = '',
  showIcon = true,
  confirm = false,
  style,
  onBeforeLogout,
  onLogoutComplete,
  onLogoutError,
}: LogoutButtonProps) {
  const handleClick = async () => {
    try {
      onBeforeLogout?.()

      if (confirm && !window.confirm('¿Estás seguro de que quieres cerrar sesión?')) return

      const { logoutAndRedirect } = await import('@/utils/authUtils')
      await logoutAndRedirect()

      onLogoutComplete?.()
    } catch (error) {
      console.error('❌ Error en logout:', error)
      onLogoutError?.(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition ${className}`}
      style={style}
    >
      {showIcon && <LogOut className="size-4" />}
      {text}
    </button>
  )
}
