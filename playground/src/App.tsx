import { useState, useCallback, useMemo } from 'react'
import type {
  A2UIMessage as A2UIMessageV08,
  A2UIAction as A2UIActionV08,
} from '@a2ui-sdk/react/0.8'
import type {
  A2UIMessage as A2UIMessageV09,
  A2UIAction as A2UIActionV09,
} from '@a2ui-sdk/react/0.9'
import { Header } from './components/Header'
import { ThemeToggle } from './components/ThemeToggle'
import { JsonEditor } from './components/JsonEditor'
import { Preview } from './components/Preview'
import { ExampleSelector } from './components/ExampleSelector'
import { VersionSelector, type A2UIVersion } from './components/VersionSelector'
import { useTheme } from './hooks/useTheme'
import { examples as examplesV08 } from './data/examples'
import { examplesV09 } from './data/examples-v0.9'
import './App.css'

type A2UIMessage = A2UIMessageV08 | A2UIMessageV09
type A2UIAction = A2UIActionV08 | A2UIActionV09

function getInitialState() {
  const params = new URLSearchParams(window.location.search)
  const version: A2UIVersion = params.get('version') === '0.9' ? '0.9' : '0.8'
  const examples = version === '0.9' ? examplesV09 : examplesV08
  const exampleId = params.get('example')
  const example = examples.find((e) => e.id === exampleId) ?? examples[0]

  return {
    version,
    exampleId: example?.id ?? '',
    jsonContent: example ? JSON.stringify(example.messages, null, 2) : '',
    parsedMessages: (example?.messages as A2UIMessage[]) ?? null,
  }
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const [initialState] = useState(getInitialState)
  const [version, setVersion] = useState<A2UIVersion>(initialState.version)
  const [selectedExampleId, setSelectedExampleId] = useState(
    initialState.exampleId
  )
  const [jsonContent, setJsonContent] = useState(initialState.jsonContent)
  const [parsedMessages, setParsedMessages] = useState<A2UIMessage[] | null>(
    initialState.parsedMessages
  )
  const [parseError, setParseError] = useState<string | null>(null)

  const examples = useMemo(
    () => (version === '0.9' ? examplesV09 : examplesV08),
    [version]
  )

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

  const handleExampleSelect = useCallback(
    (id: string) => {
      setSelectedExampleId(id)
      const example = examples.find((e) => e.id === id)
      if (example) {
        const json = JSON.stringify(example.messages, null, 2)
        setJsonContent(json)
        setParsedMessages(example.messages as A2UIMessage[])
        setParseError(null)
        // Update URL query parameter
        const url = new URL(window.location.href)
        url.searchParams.set('example', id)
        window.history.replaceState(null, '', url.toString())
      }
    },
    [examples]
  )

  const handleVersionChange = useCallback(
    (newVersion: A2UIVersion) => {
      setVersion(newVersion)
      const newExamples = newVersion === '0.9' ? examplesV09 : examplesV08
      // Find matching example or fallback to first
      const matchingExample = newExamples.find(
        (e) => e.id === selectedExampleId
      )
      const newExample = matchingExample ?? newExamples[0]
      if (newExample) {
        setSelectedExampleId(newExample.id)
        const json = JSON.stringify(newExample.messages, null, 2)
        setJsonContent(json)
        setParsedMessages(newExample.messages as A2UIMessage[])
        setParseError(null)
      }
      // Update URL query parameters
      const url = new URL(window.location.href)
      url.searchParams.set('version', newVersion)
      url.searchParams.set('example', newExample?.id ?? '')
      window.history.replaceState(null, '', url.toString())
    },
    [selectedExampleId]
  )

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
            <VersionSelector version={version} onChange={handleVersionChange} />
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
          <div className="panel-header">Preview ({`v${version}`})</div>
          <div className="panel-content">
            <Preview
              version={version}
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
