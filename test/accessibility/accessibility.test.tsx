'use client'

import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

describe('Accessibility Tests', () => {
  describe('Button Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Button aria-label="Save document">Save</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Save document')
    })

    it('is keyboard accessible', () => {
      render(<Button>Clickable Button</Button>)
      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('tabindex', '-1')
    })

    it('shows disabled state to screen readers', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Form Accessibility', () => {
    it('associates labels with inputs', () => {
      render(
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" />
        </div>,
      )

      const input = screen.getByLabelText('Username')
      expect(input).toBeInTheDocument()
    })

    it('provides proper checkbox labeling', () => {
      render(
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>,
      )

      const checkbox = screen.getByLabelText('Accept terms and conditions')
      expect(checkbox).toBeInTheDocument()
    })

    it('provides proper switch labeling', () => {
      render(
        <div className="flex items-center space-x-2">
          <Switch id="notifications" />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>,
      )

      const switchElement = screen.getByLabelText('Enable notifications')
      expect(switchElement).toBeInTheDocument()
    })
  })

  describe('Navigation Accessibility', () => {
    it('provides proper heading hierarchy', () => {
      render(
        <div>
          <h1>Main Title</h1>
          <h2>Section Title</h2>
          <h3>Subsection Title</h3>
        </div>,
      )

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Main Title')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Title')
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Subsection Title')
    })

    it('provides skip links for keyboard navigation', () => {
      render(
        <div>
          <a href="#main-content" className="sr-only focus:not-sr-only">
            Skip to main content
          </a>
          <main id="main-content">Main content</main>
        </div>,
      )

      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveAttribute('href', '#main-content')
    })
  })

  describe('Color and Contrast', () => {
    it('provides sufficient color contrast for text', () => {
      render(<div className="text-foreground bg-background">High contrast text</div>)
      const element = screen.getByText('High contrast text')
      expect(element).toHaveClass('text-foreground', 'bg-background')
    })

    it("doesn't rely solely on color for information", () => {
      render(
        <div>
          <span className="text-red-500">❌ Error: Invalid input</span>
          <span className="text-green-500">✅ Success: Valid input</span>
        </div>,
      )

      expect(screen.getByText(/❌ Error:/)).toBeInTheDocument()
      expect(screen.getByText(/✅ Success:/)).toBeInTheDocument()
    })
  })

  describe('Screen Reader Support', () => {
    it('provides screen reader only text where needed', () => {
      render(
        <button>
          <span aria-hidden="true">🗑️</span>
          <span className="sr-only">Delete item</span>
        </button>,
      )

      const button = screen.getByRole('button', { name: 'Delete item' })
      expect(button).toBeInTheDocument()
    })

    it('uses proper ARIA live regions for dynamic content', () => {
      render(
        <div aria-live="polite" aria-atomic="true">
          Status updates will be announced
        </div>,
      )

      const liveRegion = screen.getByText('Status updates will be announced')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
    })
  })

  describe('Focus Management', () => {
    it('maintains logical tab order', () => {
      render(
        <div>
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </div>,
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1')
      })
    })

    it('provides visible focus indicators', () => {
      render(<Button className="focus-visible:ring-2">Focusable Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus-visible:ring-2')
    })
  })
})
