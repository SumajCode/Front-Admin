import '@/lib/webComponents'
import '@/types'
import type React from 'react'
import './globals.css'
import Layout from '@/layout/Layout'
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FrontAdmin - Panel de Administración</title>
      </head>
      <body>
        <Layout>{children}</Layout>
        <Toaster />
      </body>
    </html>
  )
}
