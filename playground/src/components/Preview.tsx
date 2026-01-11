import { Component, type ReactNode } from 'react'
import {
  A2UIRender,
  type A2UIMessage,
  type A2UIAction,
} from '@easyops-cn/a2ui-react/0.8'
import { ErrorDisplay } from './ErrorDisplay'

interface ErrorBoundaryProps {
  children: ReactNode
  onError?: (error: Error) => void
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
    if (prevProps.children !== this.props.children && this.state.hasError) {
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

interface PreviewProps {
  messages: A2UIMessage[] | null
  error: string | null
  onAction?: (action: A2UIAction) => void
}

export function Preview({ messages, error, onAction }: PreviewProps) {
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

  return (
    <ErrorBoundary>
      <A2UIRender messages={messages} onAction={onAction} />
    </ErrorBoundary>
  )
}
