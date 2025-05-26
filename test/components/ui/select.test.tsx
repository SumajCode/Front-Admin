'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'

describe('Select Components', () => {
  it('renders select with trigger and placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('opens dropdown and shows options when clicked', async () => {
    const user = userEvent.setup()

    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    )

    const trigger = screen.getByRole('combobox')
    await user.click(trigger)

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('selects option when clicked', async () => {
    const user = userEvent.setup()
    const mockOnValueChange = jest.fn()

    render(
      <Select onValueChange={mockOnValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    )

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Option 1'))

    expect(mockOnValueChange).toHaveBeenCalledWith('option1')
  })

  it('renders select groups with labels', async () => {
    const user = userEvent.setup()

    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group 1</SelectLabel>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    )

    await user.click(screen.getByRole('combobox'))

    expect(screen.getByText('Group 1')).toBeInTheDocument()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('shows selected value', () => {
    render(
      <Select value="option1">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>,
    )

    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeDisabled()
  })
})
