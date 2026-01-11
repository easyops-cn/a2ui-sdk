import { useState, useCallback, useEffect } from 'react'
import type { A2UIMessage, A2UIAction } from '@easyops-cn/a2ui-react/0.8'
import { Header } from './components/Header'
import { ThemeToggle } from './components/ThemeToggle'
import { JsonEditor } from './components/JsonEditor'
import { Preview } from './components/Preview'
import { ExampleSelector } from './components/ExampleSelector'
import { useTheme } from './hooks/useTheme'
import { examples } from './data/examples'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [selectedExampleId, setSelectedExampleId] = useState(
    examples[0]?.id ?? ''
  )
  const [jsonContent, setJsonContent] = useState('')
  const [parsedMessages, setParsedMessages] = useState<A2UIMessage[] | null>(
    null
  )
  const [parseError, setParseError] = useState<string | null>(null)

  // Load initial example
  useEffect(() => {
    const example = examples.find((e) => e.id === selectedExampleId)
    if (example) {
      const json = JSON.stringify(example.messages, null, 2)
      setJsonContent(json)
      setParsedMessages(example.messages)
      setParseError(null)
    }
  }, [])

  const handleJsonChange = useCallback((value: string) => {
    setJsonContent(value)
    try {
      const parsed = JSON.parse(value)
      if (!Array.isArray(parsed)) {
        setParseError('JSON must be an array of A2UI messages')
        setParsedMessages(null)
      } else {
        setParsedMessages(parsed)
        setParseError(null)
      }
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Invalid JSON')
      setParsedMessages(null)
    }
  }, [])

  const handleExampleSelect = useCallback((id: string) => {
    setSelectedExampleId(id)
    const example = examples.find((e) => e.id === id)
    if (example) {
      const json = JSON.stringify(example.messages, null, 2)
      setJsonContent(json)
      setParsedMessages(example.messages)
      setParseError(null)
    }
  }, [])

  const handleAction = useCallback((action: A2UIAction) => {
    console.log('Action dispatched:', action)
  }, [])

  return (
    <div className="app">
      <Header title="A2UI React Renderer">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </Header>
      <main className="main-content">
        <div className="panel editor-panel">
          <div className="panel-header">
            <ExampleSelector
              examples={examples}
              selectedId={selectedExampleId}
              onSelect={handleExampleSelect}
            />
          </div>
          <div className="panel-content">
            <JsonEditor
              value={jsonContent}
              onChange={handleJsonChange}
              theme={theme}
            />
          </div>
        </div>
        <div className="panel preview-panel">
          <div className="panel-header">Preview</div>
          <div className="panel-content">
            <Preview
              messages={parsedMessages}
              error={parseError}
              onAction={handleAction}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
