import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { AskAIWidget } from 'open-ask-ai'

const exampleQuestions = [
  'What is A2UI SDK?',
  'How do I integrate A2UI SDK?',
  'Show me an example of using the A2UI SDK',
  'How can I customize components when using the A2UI SDK?',
]

function initializeAskAI() {
  const navAskAi = document.querySelector('#nav-ask-ai')
  if (!navAskAi) {
    return
  }
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
      apiUrl="https://lab.shenwei.xyz"
      exampleQuestions={exampleQuestions}
      systemPrompt="You are a documentation assistant for A2UI SDK. Answer based only on the provided documentation files in the current directory. When you don't have knowledge about the user question, always try to find and read relevant doc files in the current directory first.\n\nRules:\n- Never mention file paths or directories. Use documentation URLs from frontmatter as resource links at the end.\n- Output in markdown, use proper formatting such as inline code when referring to code elements.\n- Use the user's language."
    />
  )
}

function getPreferColorScheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

initializeAskAI()
