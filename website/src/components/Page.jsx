import { useSiteContext } from 'plain-blog/SiteContext'

export default function Page({ title, meta, children }) {
  const { stylesheets, site, locales, scripts } = useSiteContext()

  return (
    <html lang={title === 'Introducing Plain Blog' ? 'en-US' : locales?.[0]}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        {meta &&
          Object.entries(meta).map(
            ([name, content]) =>
              content && <meta key="name" name={name} content={content} />
          )}
        {site.favicon && <link rel="icon" href={site.favicon} />}
        {stylesheets?.map((url) => (
          <link key={url} rel="stylesheet" href={url} />
        ))}
        {scripts?.map((url) => (
          <script key={url} src={url} async />
        ))}
      </head>
      <body>{children}</body>
    </html>
  )
}
