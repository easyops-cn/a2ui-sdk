import { useSiteContext } from 'plain-blog/SiteContext'

export default function Header(props) {
  const { baseUrl, site, url } = useSiteContext()

  return (
    <header>
      <h1>
        <a href={baseUrl}>{site.title}</a>
      </h1>
      <div className="header-right">
        <nav className="header-nav">
          <a href={baseUrl} className={url === baseUrl ? 'active' : ''}>
            Docs
          </a>
          <a
            href={`${baseUrl}api/`}
            className={url === `${baseUrl}api/` ? 'active' : ''}
          >
            API
          </a>
          <a href={`${baseUrl}playground/`}>Playground</a>
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
        <color-mode-switch />
      </div>
    </header>
  )
}
