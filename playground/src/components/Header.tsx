import type { ReactNode } from 'react'

interface HeaderProps {
  title: string
  children?: ReactNode
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">{title}</h1>
        <nav className="header-nav">
          <a href="/a2ui-react/">Docs</a>
          <a href="/a2ui-react/playground/" className="active">
            Playground
          </a>
        </nav>
      </div>
      <div className="app-header-actions">{children}</div>
    </header>
  )
}
