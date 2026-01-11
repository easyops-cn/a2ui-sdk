import type { Example } from '../data/examples'

interface ExampleSelectorProps {
  examples: Example[]
  selectedId: string
  onSelect: (id: string) => void
}

export function ExampleSelector({
  examples,
  selectedId,
  onSelect,
}: ExampleSelectorProps) {
  return (
    <div className="example-selector">
      <label htmlFor="example-select" className="example-selector-label">
        Example:
      </label>
      <select
        id="example-select"
        className="example-selector-dropdown"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
      >
        {examples.map((example) => (
          <option key={example.id} value={example.id}>
            {example.title}
          </option>
        ))}
      </select>
      <span className="example-selector-description">
        {examples.find((e) => e.id === selectedId)?.description}
      </span>
    </div>
  )
}
