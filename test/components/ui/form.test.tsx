'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
})

function TestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}

describe('Form Components', () => {
  it('renders form with all components', () => {
    render(<TestForm />)

    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
    expect(screen.getByText('This is your public display name.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('shows validation error on invalid input', async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    const submitButton = screen.getByRole('button', { name: 'Submit' })
    await user.click(submitButton)

    expect(screen.getByText('Username must be at least 2 characters')).toBeInTheDocument()
  })

  it('clears error when valid input is entered', async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    const input = screen.getByPlaceholderText('Enter username')
    const submitButton = screen.getByRole('button', { name: 'Submit' })

    // Trigger validation error
    await user.click(submitButton)
    expect(screen.getByText('Username must be at least 2 characters')).toBeInTheDocument()

    // Enter valid input
    await user.type(input, 'validusername')
    await user.click(submitButton)

    expect(screen.queryByText('Username must be at least 2 characters')).not.toBeInTheDocument()
  })

  it('associates label with input correctly', () => {
    render(<TestForm />)

    const input = screen.getByLabelText('Username')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Enter username')
  })
})
