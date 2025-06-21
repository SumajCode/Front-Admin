"use client"

/**
 * Maneja la redirección después del login exitoso
 */
export function handleAuthRedirect() {
  if (typeof window === "undefined") return

  // Verificar si venimos de una redirección del login
  const urlParams = new URLSearchParams(window.location.search)
  const authSuccess = urlParams.get("auth")
  const token = urlParams.get("token")
  const userData = urlParams.get("user")

  if (authSuccess === "success" && token && userData) {
    try {
      // Decodificar y guardar los datos de autenticación
      const decodedUserData = JSON.parse(decodeURIComponent(userData))

      localStorage.setItem("access_token", token)
      localStorage.setItem("admin_data", JSON.stringify(decodedUserData))

      console.log("✅ Autenticación exitosa desde login remoto")
      console.log("👤 Usuario:", decodedUserData)

      // Limpiar la URL
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)

      // Recargar para actualizar el contexto de autenticación
      window.location.reload()
    } catch (error) {
      console.error("❌ Error procesando datos de autenticación:", error)
    }
  }
}

/**
 * Redirige al frontend de login con la URL de retorno
 */
export function redirectToLogin() {
  const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL || "https://front-loginv1-kevinurena82-6772s-projects.vercel.app"
  const currentUrl = window.location.href
  const redirectUrl = `${loginUrl}?redirect=${encodeURIComponent(currentUrl)}`

  console.log("🔄 Redirigiendo al login:", redirectUrl)
  window.location.href = redirectUrl
}
