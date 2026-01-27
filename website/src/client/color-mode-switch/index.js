// @ts-check
import ColorModeCss from './style.css'
import MoonSvg from './moon.svg'
import SunSvg from './sun.svg'

if (CSS.supports('color-scheme', 'dark')) {
  customElements.define(
    'color-mode-switch',
    class ColorModeSwitchElement extends HTMLElement {
      /** @type {HTMLElement} */
      _switch

      /** @type {string} */
      _theme

      constructor() {
        super()

        const shadowRoot = this.attachShadow({
          mode: 'open',
          delegatesFocus: true,
        })

        shadowRoot.innerHTML = `<style>${ColorModeCss}</style><a role="button" tabindex="0" aria-label="Toggle theme">${MoonSvg}${SunSvg}</a>`

        // @ts-ignore
        this._switch = shadowRoot.querySelector('a')
        this._setTheme(localStorage.getItem('theme') || getPreferColorScheme())
      }

      _clickHandler = () => {
        const currentTheme = document.documentElement.dataset.theme
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
        this._setTheme(nextTheme, true)
      }

      /**
       * @param {string} theme
       * @param {boolean=} force
       */
      _setTheme(theme, force) {
        this._theme = theme
        document.documentElement.dataset.theme = theme
        this._switch.dataset.theme = theme
        if (force) {
          localStorage.setItem('theme', theme)
        }
        this.dispatchEvent(
          new CustomEvent('themechange', { detail: { theme } })
        )
      }

      getTheme() {
        return this._theme
      }

      connectedCallback() {
        this._switch.addEventListener('click', this._clickHandler)
      }

      disconnectedCallback() {
        this._switch.removeEventListener('click', this._clickHandler)
      }
    }
  )

  function getPreferColorScheme() {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
}
