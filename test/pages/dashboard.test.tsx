'use client'

import { render, screen } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'

describe('Dashboard Page', () => {
  it('renders the dashboard page', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Building Your Application')).toBeInTheDocument()
    expect(screen.getByText('Data Fetching')).toBeInTheDocument()
  })

  it('renders sidebar trigger', () => {
    render(<DashboardPage />)
    const trigger = screen.getByRole('button', { name: /toggle sidebar/i })
    expect(trigger).toBeInTheDocument()
  })

  it('renders breadcrumb navigation', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Building Your Application')).toBeInTheDocument()
    expect(screen.getByText('Data Fetching')).toBeInTheDocument()
  })

  it('renders grid layout', () => {
    render(<DashboardPage />)
    const gridContainer = document.querySelector('.grid.auto-rows-min')
    expect(gridContainer).toBeInTheDocument()
  })

  it('renders placeholder content areas', () => {
    render(<DashboardPage />)
    const placeholders = document.querySelectorAll('.bg-muted\\/50')
    expect(placeholders.length).toBeGreaterThan(0)
  })

  it('has responsive design classes', () => {
    render(<DashboardPage />)
    const gridContainer = document.querySelector('.md\\:grid-cols-3')
    expect(gridContainer).toBeInTheDocument()
  })
})
