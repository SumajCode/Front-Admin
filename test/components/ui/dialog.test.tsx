'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

describe('Dialog Components', () => {
  it('renders dialog when triggered', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button>Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )

    const trigger = screen.getByText('Open Dialog')
    await user.click(trigger)

    expect(screen.getByText('Dialog Title')).toBeInTheDocument()
    expect(screen.getByText('Dialog Description')).toBeInTheDocument()
  })

  it('closes dialog when close button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByText('Open Dialog'))
    expect(screen.getByText('Dialog Title')).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
  })

  it('handles controlled open state', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Always Open</DialogTitle>
        </DialogContent>
      </Dialog>,
    )

    expect(screen.getByText('Always Open')).toBeInTheDocument()
  })

  it('calls onOpenChange when dialog state changes', async () => {
    const user = userEvent.setup()
    const mockOnOpenChange = jest.fn()

    render(
      <Dialog onOpenChange={mockOnOpenChange}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByText('Open Dialog'))
    expect(mockOnOpenChange).toHaveBeenCalledWith(true)
  })
})
