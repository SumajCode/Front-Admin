import * as webComponents from '@/lib/webComponents'

describe('webComponents', () => {
  describe('areWebComponentsReady', () => {
    it('returns true if all custom elements are defined', () => {
      const tags: [string, CustomElementConstructor][] = [
        ['auth-guard', class extends HTMLElement {}],
        ['logout-button', class extends HTMLElement {}],
        ['user-info', class extends HTMLElement {}],
      ]
      tags.forEach(([tag, klass]) => {
        if (!customElements.get(tag)) {
          customElements.define(tag as string, klass)
        }
      })
      expect(webComponents.areWebComponentsReady()).toBe(true)
    })
  })

  describe('waitForWebComponents', () => {
    it('resolves when components are ready', async () => {
      // Define los elementos si no existen
      const tags: [string, CustomElementConstructor][] = [
        ['auth-guard', class extends HTMLElement {}],
        ['logout-button', class extends HTMLElement {}],
        ['user-info', class extends HTMLElement {}],
      ]
      tags.forEach(([tag, klass]) => {
        if (!customElements.get(tag)) {
          customElements.define(tag as string, klass)
        }
      })
      await expect(webComponents.waitForWebComponents()).resolves.toBeUndefined()
    })
  })
})
