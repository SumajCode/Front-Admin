import Layout from '@/layout/Layout'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <Layout>
        <body>{children}</body>
      </Layout>
    </html>
  )
}
