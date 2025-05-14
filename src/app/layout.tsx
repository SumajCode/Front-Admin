import type React from 'react'
import Layout from '@/layout/Layout'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <Layout>
        <body>
          {children}
          <Toaster />
        </body>
      </Layout>
    </html>
  )
}
