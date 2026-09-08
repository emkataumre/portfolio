import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

import { SITE_URL, site } from './src/site.js'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: 'Emil Vladinov',
      inLanguage: 'en',
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}#profile`,
      url: SITE_URL,
      isPartOf: { '@id': `${SITE_URL}#website` },
      dateCreated: '2026-09-02',
      mainEntity: { '@id': `${SITE_URL}#person` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}#person`,
      name: 'Emil Vladinov',
      jobTitle: 'Software engineer',
      description:
        'Real software, built with AI agents. The agents write the code. The engineering does not change: small steps, tests, review, and runtime verification. Software engineer in Copenhagen.',
      url: SITE_URL,
      image: `${SITE_URL}avatar/pose-center.webp`,
      email: site.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Copenhagen',
        addressCountry: 'DK',
      },
      worksFor: [
        { '@type': 'Organization', name: 'Inact' },
        { '@type': 'Organization', name: 'Solution 8' },
      ],
      knowsAbout: [
        'Agentic coding',
        'AI coding agents',
        'Agentic workflows',
        'Code review',
        'Runtime verification',
        'Go',
        'React',
      ],
      sameAs: [site.github, site.linkedin],
    },
  ],
}

function structuredDataPlugin(): Plugin {
  return {
    name: 'structured-data',
    transformIndexHtml(html) {
      return html.replace(
        '<!-- structured-data -->',
        `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n</script>`,
      )
    },
  }
}

export default defineConfig({
  appType: 'mpa',
  plugins: [react(), tailwindcss(), structuredDataPlugin()],
})
