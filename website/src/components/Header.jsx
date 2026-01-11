import { useSiteContext } from 'plain-blog/SiteContext'

export default function Header() {
  const { baseUrl, site } = useSiteContext()

  return (
    <header>
      <div className="title-container">
        <div className="header-left">
          <h1>
            <a href={baseUrl}>{site.title}</a>
          </h1>
          <nav className="header-nav">
            <a href={baseUrl} className="active">
              Docs
            </a>
            <a href={`${baseUrl}playground/`}>Playground</a>
          </nav>
        </div>
        <color-mode-switch />
      </div>
    </header>
  )
}
