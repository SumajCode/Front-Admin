import type React from "react"
import "./globals.css"
import Layout from "@/layout/Layout"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { AuthRedirectHandler } from "@/components/auth/AuthRedirectHandler"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FrontAdmin - Panel de Administración</title>
      </head>
      <body>
        <AuthProvider>
          <AuthRedirectHandler />
          <Layout>{children}</Layout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
