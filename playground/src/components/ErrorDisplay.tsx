interface ErrorDisplayProps {
  title?: string
  message: string
}

export function ErrorDisplay({ title = 'Error', message }: ErrorDisplayProps) {
  return (
    <div className="error-display">
      <div className="error-title">{title}</div>
      <pre className="error-message">{message}</pre>
    </div>
  )
}
