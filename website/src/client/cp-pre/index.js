// @ts-check
import CpPreCss from './style.css'
import CopyIcon from './copy.svg'
import CheckIcon from './check.svg'

class CpPre extends HTMLElement {
  /** @type {HTMLButtonElement} */
  _button

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open', delegatesFocus: true })
    shadowRoot.innerHTML = `<style>${CpPreCss}</style><button aria-label="Copy code to clipboard">${CopyIcon}</button><slot></slot>`

    this._button = shadowRoot.querySelector('button')
  }

  _clickHandler = () => {
    const code = this.querySelector('code')
    navigator.clipboard.writeText(code?.textContent || '')
    this._button.innerHTML = CheckIcon
    setTimeout(() => (this._button.innerHTML = CopyIcon), 2000)
  }

  connectedCallback() {
    this._button.addEventListener('click', this._clickHandler)
  }

  disconnectedCallback() {
    this._button.removeEventListener('click', this._clickHandler)
  }
}

customElements.define('cp-pre', CpPre)
