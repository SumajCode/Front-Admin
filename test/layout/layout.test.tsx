'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Layout from '@/layout/Layout'

// Mock para carga de Web Components
jest.mock('@/lib/webComponents', () => ({
  loadWebComponents: jest.fn().mockResolvedValue(undefined),
}))

// Mock para autenticación
jest.mock('@/utils/authUtils', () => ({
  isAuthenticated: jest.fn(() => true),
}))

beforeEach(() => {
  jest.clearAllMocks()
  // Disparar evento de autenticación simulada antes del render
  setTimeout(() => {
    const event = new CustomEvent('user-authenticated', { detail: { user: 'mock' } })
    window.dispatchEvent(event)
  }, 0)
})

describe('Layout Component', () => {
  it('renders children content', async () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    )

    expect(await screen.findByText('Test Content')).toBeInTheDocument()
  })

  

  it('renders with proper layout structure', async () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    )

    const header = await screen.findByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('flex', 'h-16')
  })

  it('applies responsive classes', async () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    )

    const header = await screen.findByRole('banner')
    expect(header).toHaveClass('group-has-data-[collapsible=icon]/sidebar-wrapper:h-12')
  })

  it('renders content in proper container', async () => {
    render(
      <Layout>
        <div data-testid="layout-content">Layout Content</div>
      </Layout>,
    )

    const content = await screen.findByTestId('layout-content')
    const container = content.closest('.flex.flex-1.flex-col')
    expect(container).toBeInTheDocument()
  })
})
