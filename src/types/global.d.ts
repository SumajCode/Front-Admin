import type React from "react"
// Declaraciones globales para TypeScript

// Eventos personalizados
interface CustomEventMap {
  tokenRefreshed: CustomEvent<{ newToken: string }>
  userLoggedOut: CustomEvent
  authGuardSuccess: CustomEvent<{
    user: any
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
      listener: (this: Window, ev: CustomEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => any,
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
}
