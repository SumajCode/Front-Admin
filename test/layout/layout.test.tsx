'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Layout from '@/layout/Layout'

describe('Layout Component', () => {
  it('renders children content', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders sidebar trigger', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    )

    const trigger = screen.getByRole('button', { name: /toggle sidebar/i })
    expect(trigger).toBeInTheDocument()
  })

  it('toggles sidebar when trigger is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    )

    const trigger = screen.getByRole('button', { name: /toggle sidebar/i })
    await user.click(trigger)

    // Sidebar should still be accessible after toggle
    expect(trigger).toBeInTheDocument()
  })

  it('renders with proper layout structure', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    )

    const header = document.querySelector('header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('flex', 'h-16')
  })

  it('applies responsive classes', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    )

    const header = document.querySelector('header')
    expect(header).toHaveClass('group-has-data-[collapsible=icon]/sidebar-wrapper:h-12')
  })

  it('renders content in proper container', () => {
    render(
      <Layout>
        <div data-testid="layout-content">Layout Content</div>
      </Layout>,
    )

    const content = screen.getByTestId('layout-content')
    const container = content.closest('.flex.flex-1.flex-col')
    expect(container).toBeInTheDocument()
  })
})
