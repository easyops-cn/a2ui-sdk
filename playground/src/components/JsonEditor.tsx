import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  theme?: 'light' | 'dark'
}

export function JsonEditor({
  value,
  onChange,
  theme = 'light',
}: JsonEditorProps) {
  return (
    <CodeMirror
      value={value}
      extensions={[json()]}
      onChange={onChange}
      theme={theme}
      className="json-editor"
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightActiveLine: true,
        foldGutter: true,
        bracketMatching: true,
        autocompletion: true,
      }}
    />
  )
}
