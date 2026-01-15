// @ts-check
/** @type {import("plain-blog").SiteConfig} */
export default {
  site: {
    title: 'A2UI SDK',
    description: 'The SDK for A2UI protocol',
    favicon: 'assets/favicon.svg',
    url: 'https://a2ui-sdk.js.org',
  },
  locales: ['en'],
  toc: true,
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
  elementTransforms: {
    pre: 'cp-pre',
  },
  styles: ['src/global.css'],
  scripts: ['src/client/index.js'],
}
