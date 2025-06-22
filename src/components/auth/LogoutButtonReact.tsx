'use client'

import React from 'react'
import { useEffect, useRef } from 'react'
import '@/components/auth/LogoutButton'

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
  className = 'logout-btn',
  showIcon = true,
  confirm = false,
  style,
  onBeforeLogout,
  onLogoutComplete,
  onLogoutError,
}: LogoutButtonProps) {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleBeforeLogout = (event: Event) => {
      const customEvent = event as CustomEvent<{ timestamp: string }>
      onBeforeLogout?.()
    }

    const handleLogoutComplete = (event: Event) => {
      const customEvent = event as CustomEvent<{ timestamp: string }>
      onLogoutComplete?.()
    }

    const handleLogoutError = (event: Event) => {
      const customEvent = event as CustomEvent<{ error: string; timestamp: string }>
      onLogoutError?.(customEvent.detail?.error || 'Error desconocido')
    }

    element.addEventListener('beforeLogout', handleBeforeLogout)
    element.addEventListener('logoutComplete', handleLogoutComplete)
    element.addEventListener('logoutError', handleLogoutError)

    return () => {
      element.removeEventListener('beforeLogout', handleBeforeLogout)
      element.removeEventListener('logoutComplete', handleLogoutComplete)
      element.removeEventListener('logoutError', handleLogoutError)
    }
  }, [onBeforeLogout, onLogoutComplete, onLogoutError])

  // Crear el elemento usando React.createElement para evitar problemas de tipos
  return React.createElement('logout-button', {
    ref: elementRef,
    text,
    class: className,
    'show-icon': showIcon.toString(),
    confirm: confirm.toString(),
    style: style
      ? Object.entries(style)
          .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
          .join('; ')
      : undefined,
  })
}
