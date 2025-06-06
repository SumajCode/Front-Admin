'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'

describe('Sheet Components', () => {
  it('renders sheet when triggered', async () => {
    const user = userEvent.setup()

    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <div>Sheet Content</div>
          <SheetFooter>
            <button>Footer Button</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    )

    const trigger = screen.getByText('Open Sheet')
    await user.click(trigger)

    expect(screen.getByText('Sheet Title')).toBeInTheDocument()
    expect(screen.getByText('Sheet Description')).toBeInTheDocument()
    expect(screen.getByText('Sheet Content')).toBeInTheDocument()
    expect(screen.getByText('Footer Button')).toBeInTheDocument()
  })

  it('closes sheet when close button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByText('Open Sheet'))
    expect(screen.getByText('Sheet Title')).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument()
  })

  it('renders sheet on different sides', async () => {
    const user = userEvent.setup()

    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent side="left">
          <SheetTitle>Left Sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByText('Open Sheet'))
    expect(screen.getByText('Left Sheet')).toBeInTheDocument()
  })

  it('handles controlled open state', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Always Open Sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    )

    expect(screen.getByText('Always Open Sheet')).toBeInTheDocument()
  })

  it('calls onOpenChange when sheet state changes', async () => {
    const user = userEvent.setup()
    const mockOnOpenChange = jest.fn()

    render(
      <Sheet onOpenChange={mockOnOpenChange}>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Test Sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByText('Open Sheet'))
    expect(mockOnOpenChange).toHaveBeenCalledWith(true)
  })
})
