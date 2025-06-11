import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(...classNames: string[]): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeChecked(): R
      toHaveValue(value: string | number | string[]): R
      toHaveDisplayValue(value: string | string[]): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveTextContent(text: string | RegExp): R
      toContainElement(element: HTMLElement | null): R
      toBeEmptyDOMElement(): R
      toBeInvalid(): R
      toBeValid(): R
      toHaveFocus(): R
      toHaveFormValues(expectedValues: Record<string, unknown>): R
      toHaveStyle(css: string | Record<string, unknown>): R
      toHaveErrorMessage(text: string | RegExp): R
      toHaveDescription(text: string | RegExp): R
      toHaveAccessibleName(text: string | RegExp): R
      toHaveAccessibleDescription(text: string | RegExp): R
      toBePartiallyChecked(): R
      toHaveRole(role: string): R
    }
  }
}
