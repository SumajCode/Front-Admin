import type React from "react"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "auth-guard": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      "logout-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          text?: string
          class?: string
          "show-icon"?: string
          confirm?: string
          style?: string
        },
        HTMLElement
      >
      "user-info": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "show-avatar"?: string
          "show-email"?: string
          "show-role"?: string
          layout?: string
        },
        HTMLElement
      >
    }
  }

  interface HTMLElementTagNameMap {
    "auth-guard": HTMLElement
    "logout-button": HTMLElement
    "user-info": HTMLElement
  }
}
