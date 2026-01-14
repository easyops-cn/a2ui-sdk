import { Component, type ReactNode } from 'react'
import {
  A2UIProvider as A2UIProviderV08,
  A2UIRenderer as A2UIRendererV08,
  type A2UIMessage as A2UIMessageV08,
  type A2UIAction as A2UIActionV08,
} from '@a2ui-sdk/react/0.8'
import {
  A2UIProvider as A2UIProviderV09,
  A2UIRenderer as A2UIRendererV09,
  type A2UIMessage as A2UIMessageV09,
  type A2UIAction as A2UIActionV09,
} from '@a2ui-sdk/react/0.9'
import { ErrorDisplay } from './ErrorDisplay'
import type { A2UIVersion } from './VersionSelector'

interface ErrorBoundaryProps {
  children: ReactNode
  onError?: (error: Error) => void
  resetKey?: string | number
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (
      (prevProps.children !== this.props.children ||
        prevProps.resetKey !== this.props.resetKey) &&
      this.state.hasError
    ) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          title="Render Error"
          message={
            this.state.error?.message || 'An error occurred while rendering'
          }
        />
      )
    }
    return this.props.children
  }
}

type A2UIMessage = A2UIMessageV08 | A2UIMessageV09
type A2UIAction = A2UIActionV08 | A2UIActionV09

interface PreviewProps {
  version: A2UIVersion
  messages: A2UIMessage[] | null
  error: string | null
  onAction?: (action: A2UIAction) => void
}

export function Preview({ version, messages, error, onAction }: PreviewProps) {
  if (error) {
    return <ErrorDisplay title="JSON Parse Error" message={error} />
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="preview-empty">
        Enter valid A2UI JSON to see the preview
      </div>
    )
  }

  if (version === '0.9') {
    return (
      <ErrorBoundary resetKey={version}>
        <A2UIProviderV09 messages={messages as A2UIMessageV09[]}>
          <A2UIRendererV09
            onAction={onAction as (action: A2UIActionV09) => void}
          />
        </A2UIProviderV09>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary resetKey={version}>
      <A2UIProviderV08 messages={messages as A2UIMessageV08[]}>
        <A2UIRendererV08
          onAction={onAction as (action: A2UIActionV08) => void}
        />
      </A2UIProviderV08>
    </ErrorBoundary>
  )
}
