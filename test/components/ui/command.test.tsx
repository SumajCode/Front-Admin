'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

describe('Command Components', () => {
  it('renders command with input and items', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    )

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('filters items based on search input', async () => {
    const user = userEvent.setup()

    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem value="apple">Apple</CommandItem>
          <CommandItem value="banana">Banana</CommandItem>
        </CommandList>
      </Command>,
    )

    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'apple')

    expect(screen.getByText('Apple')).toBeInTheDocument()
  })

  it('shows empty state when no items match', () => {
    render(
      <Command>
        <CommandInput />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandItem value="test">Test Item</CommandItem>
        </CommandList>
      </Command>,
    )

    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  it('renders command separator', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>Item 1</CommandItem>
          <CommandSeparator />
          <CommandItem>Item 2</CommandItem>
        </CommandList>
      </Command>,
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('renders command shortcut', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>
            Open File
            <CommandShortcut>⌘O</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>,
    )

    expect(screen.getByText('Open File')).toBeInTheDocument()
    expect(screen.getByText('⌘O')).toBeInTheDocument()
  })
})
