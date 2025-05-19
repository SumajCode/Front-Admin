'use client'

import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Verificar inmediatamente
    checkMobile()

    // Configurar el listener
    window.addEventListener('resize', checkMobile)

    // Limpiar
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return !!isMobile
}
