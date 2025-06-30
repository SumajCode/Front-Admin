import * as types from '@/lib/types'

describe('types helpers', () => {
  describe('isWebComponentDefined', () => {
    it('returns false if custom element is not defined', () => {
      expect(types.isWebComponentDefined('fake-element')).toBe(false)
    })

    it('returns true if custom element is defined', () => {
      // Define a dummy custom element for test
      const tag = 'dummy-element-test'
      if (!customElements.get(tag)) {
        customElements.define(tag, class extends HTMLElement {})
      }
      expect(types.isWebComponentDefined(tag)).toBe(true)
    })
  })

  describe('waitForWebComponent', () => {
    it('resolves true if element is already defined', async () => {
      const tag = 'dummy-element-test2'
      if (!customElements.get(tag)) {
        customElements.define(tag, class extends HTMLElement {})
      }
      await expect(types.waitForWebComponent(tag, 100)).resolves.toBe(true)
    })

    it('resolves false if element is not defined within timeout', async () => {
      await expect(types.waitForWebComponent('never-defined-element', 100)).resolves.toBe(false)
    })
  })
})
