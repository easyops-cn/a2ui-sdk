import { useSiteContext } from 'plain-blog/SiteContext'

export default function Header() {
  const { baseUrl, site } = useSiteContext()

  return (
    <header className="page-header home">
      <div className="title-container">
        <h1>
          <a href={baseUrl}>{site.title}</a>
        </h1>
        <color-mode-switch />
      </div>
    </header>
  )
}
