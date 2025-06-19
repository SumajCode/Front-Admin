'use client'

import { render, screen, fireEvent } from '@testing-library/react'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from '@/components/ui/command'

describe('Command UI components', () => {
  it('renders Command', () => {
    render(
      <Command>
        <div>Command Content</div>
      </Command>,
    )
    expect(screen.getByText('Command Content')).toBeInTheDocument()
  })

  it('renders CommandDialog with children', () => {
    render(
      <CommandDialog open={true} onOpenChange={() => {}}>
        <div>Dialog Content</div>
      </CommandDialog>,
    )
    expect(screen.getByText('Dialog Content')).toBeInTheDocument()
  })

  it('renders CommandInput and accepts text', () => {
    render(
      <Command>
        <CommandInput placeholder="Buscar" />
      </Command>,
    )
    const input = screen.getByPlaceholderText('Buscar') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'hello' } })
    expect(input.value).toBe('hello')
  })

  it('renders CommandList', () => {
    render(
      <Command>
        <CommandList>
          <div>List Item</div>
        </CommandList>
      </Command>,
    )
    expect(screen.getByText('List Item')).toBeInTheDocument()
  })

  it('renders CommandEmpty', () => {
    render(
      <Command>
        <CommandEmpty>No results</CommandEmpty>
      </Command>,
    )
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('renders CommandGroup with heading', () => {
    render(
      <Command>
        <CommandGroup heading="Opciones">
          <div>Group Item</div>
        </CommandGroup>
      </Command>,
    )
    expect(screen.getByText('Opciones')).toBeInTheDocument()
    expect(screen.getByText('Group Item')).toBeInTheDocument()
  })

  it('renders CommandItem and handles selection', () => {
    const handleSelect = jest.fn()
    render(
      <Command>
        <CommandItem onSelect={handleSelect}>Select Me</CommandItem>
      </Command>,
    )
    const item = screen.getByText('Select Me')
    fireEvent.click(item)
    expect(handleSelect).toHaveBeenCalled()
  })

  it('renders CommandShortcut', () => {
    render(
      <Command>
        <CommandItem>
          Save
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </Command>,
    )
    expect(screen.getByText('⌘S')).toBeInTheDocument()
  })
})
