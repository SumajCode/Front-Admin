'use client'

import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table'

describe('Table Components', () => {
  it('renders complete table structure', () => {
    render(
      <Table>
        <TableCaption>Test Table Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cell 3</TableCell>
            <TableCell>Cell 4</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer 1</TableCell>
            <TableCell>Footer 2</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    )

    expect(screen.getByText('Test Table Caption')).toBeInTheDocument()
    expect(screen.getByText('Header 1')).toBeInTheDocument()
    expect(screen.getByText('Header 2')).toBeInTheDocument()
    expect(screen.getByText('Cell 1')).toBeInTheDocument()
    expect(screen.getByText('Cell 2')).toBeInTheDocument()
    expect(screen.getByText('Cell 3')).toBeInTheDocument()
    expect(screen.getByText('Cell 4')).toBeInTheDocument()
    expect(screen.getByText('Footer 1')).toBeInTheDocument()
    expect(screen.getByText('Footer 2')).toBeInTheDocument()
  })

  it('renders table with proper HTML structure', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
            <TableCell>25</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(2)
    expect(headers[0]).toHaveTextContent('Name')
    expect(headers[1]).toHaveTextContent('Age')

    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(2)
    expect(cells[0]).toHaveTextContent('John')
    expect(cells[1]).toHaveTextContent('25')
  })

  it('renders table caption correctly', () => {
    render(
      <Table>
        <TableCaption>A list of users and their information</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const caption = screen.getByText('A list of users and their information')
    expect(caption.tagName).toBe('CAPTION')
  })

  it('handles empty table', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empty Table</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{/* No rows */}</TableBody>
      </Table>,
    )

    expect(screen.getByText('Empty Table')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
