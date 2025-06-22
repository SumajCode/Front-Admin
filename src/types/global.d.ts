import type React from "react"

// Definir tipos específicos para los usuarios
interface UserData {
  _id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
}

// Eventos personalizados
interface CustomEventMap {
  tokenRefreshed: CustomEvent<{ newToken: string }>
  userLoggedOut: CustomEvent
  authGuardSuccess: CustomEvent<{
    user: UserData
    token: string
    role: string
    timestamp: string
  }>
  beforeLogout: CustomEvent<{ timestamp: string }>
  logoutComplete: CustomEvent<{ timestamp: string }>
  logoutError: CustomEvent<{ error: string; timestamp: string }>
}

// Extender la interfaz Window para incluir nuestros eventos personalizados
declare global {
  interface Window {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions,
    ): void
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void,
      options?: boolean | EventListenerOptions,
    ): void
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void
    dispatchEvent(event: Event): boolean
  }

  // Declarar los Web Components para JSX
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
