import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Hero, Services, Process, Lab, Team, FinalCTA } from '@everyone-web/layouts/Home';

const title = '@everyone · Diseño y desarrollo de productos digitales';
const description =
  'Webs, apps móviles, realidad aumentada y sistemas a medida para empresas y pymes. Un equipo multidisciplinar que diseña, desarrolla y lanza tu producto digital.';

export const Route = createFileRoute('/')({
  component: App,
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: 'https://arrobaeveryone.com' },
      { property: 'og:image', content: 'https://arrobaeveryone.com/logo512.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: 'https://arrobaeveryone.com/logo512.png' },
      {
        name: 'keywords',
        content:
          'desarrollo web, desarrollo de apps, aplicaciones móviles, realidad aumentada, realidad virtual, sistemas de reservas, digitalización de pymes, diseño UX/UI, estudio digital, @everyone',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://arrobaeveryone.com' }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: '@everyone',
          url: 'https://arrobaeveryone.com',
          logo: 'https://arrobaeveryone.com/logo512.png',
          description:
            'Estudio digital que diseña y desarrolla webs, apps móviles, experiencias AR/VR y sistemas a medida para empresas y pymes.',
          email: 'contacto@arrobaeveryone.com',
          sameAs: [
            'https://www.instagram.com/arroba_everyone',
            'https://github.com/arroba-everyone',
          ],
        }),
      },
    ],
  }),
});

function App() {
  return (
    <MainLayout tone="light">
      <Hero />
      <Services />
      <Process />
      <Lab />
      <Team />
      <FinalCTA />
    </MainLayout>
  );
}
