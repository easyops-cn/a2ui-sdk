// @ts-check
/** @type {import("plain-blog").SiteConfig} */
export default {
  baseUrl: '/',
  site: {
    title: 'A2UI React Renderer',
    description: 'A React renderer for A2UI protocol',
    favicon: 'assets/favicon.svg',
    url: 'https://a2ui-react.js.org',
  },
  locales: ['en'],
  shiki: {
    // theme: "light-plus",
    themes: {
      light: 'light-plus',
      dark: 'dark-plus',
    },
  },
  components: {
    // Home: 'src/components/Home.jsx',
    Page: 'src/components/Page.jsx',
    Header: 'src/components/Header.jsx',
    Footer: 'src/components/Footer.jsx',
  },
  styles: ['src/global.css'],
  scripts: ['src/client/index.js'],
}
