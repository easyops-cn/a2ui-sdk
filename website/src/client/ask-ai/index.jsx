import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { AskAIWidget } from 'open-ask-ai'
import AskAICss from 'open-ask-ai/styles.css'

const exampleQuestions = [
  'What is A2UI SDK?',
  'How do I integrate A2UI SDK?',
  'Show me an example of using the A2UI SDK',
  'How can I customize components when using the A2UI SDK?',
]

const texts = {
  welcomeMessage: 'Ask me about A2UI SDK',
}

function initializeAskAI() {
  const navAskAi = document.querySelector('#nav-ask-ai')
  if (!navAskAi) {
    setTimeout(initializeAskAI, 100)
    return
  }
  const style = document.createElement('style')
  style.textContent = AskAICss
  document.head.appendChild(style)
  const root = createRoot(navAskAi)
  root.render(<AskAI />)
}

function AskAI() {
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    const colorModeSwitch = document.querySelector('color-mode-switch')
    if (!colorModeSwitch) {
      setTheme(getPreferColorScheme())
      return
    }

    function handleThemeChange(event) {
      setTheme(event.detail.theme)
    }

    colorModeSwitch.addEventListener('themechange', handleThemeChange)

    // Initialize theme
    const initialTheme = colorModeSwitch.getTheme() || 'light'
    setTheme(initialTheme)

    return () => {
      colorModeSwitch.removeEventListener('themechange', handleThemeChange)
    }
  }, [])

  if (!theme) {
    return null
  }

  return (
    <AskAIWidget
      theme={theme}
      projectId="a2ui-sdk"
      apiUrl="https://lab.shenwei.xyz"
      texts={texts}
      exampleQuestions={exampleQuestions}
    />
  )
}

function getPreferColorScheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

initializeAskAI()
