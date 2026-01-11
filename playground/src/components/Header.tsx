import type { ReactNode } from 'react'

interface HeaderProps {
  title: string
  children?: ReactNode
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="app-header">
      <h1 className="app-title">
        <a href="/a2ui-react/">{title}</a>
      </h1>
      <div className="header-right">
        <nav className="header-nav">
          <a href="/a2ui-react/">Docs</a>
          <a href="/a2ui-react/playground/" className="active">
            Playground
          </a>
          <a
            href="https://github.com/easyops-cn/a2ui-react"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </nav>
        <div className="app-header-actions">{children}</div>
      </div>
    </header>
  )
}
