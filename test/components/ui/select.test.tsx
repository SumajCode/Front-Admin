'use client'

import { render, screen } from '@testing-library/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
})
