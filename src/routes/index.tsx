import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Landing, SecondStep, OurProjects, Chat } from '@everyone-web/layouts/Main/';
import { YouTube } from '@everyone-web/layouts/Main/YouTube';

export const Route = createFileRoute('/')({
  component: App,
  head: () => ({
    meta: [
      { title: '@Everyone - Innovar no es complicar. Es conectar.' },
      {
        name: 'description',
        content:
          'En @Everyone hacemos apps y contenido tech para humanos normales. Sin humo. Sin postureo. Con mucho corazón.',
      },
      { property: 'og:title', content: '@Everyone - Innovar no es complicar. Es conectar.' },
      {
        property: 'og:description',
        content:
          'En @Everyone hacemos apps y contenido tech para humanos normales. Sin humo. Sin postureo. Con mucho corazón.',
      },
      { property: 'og:url', content: 'https://arrobaeveryone.com' },
      { property: 'og:image', content: 'https://arrobaeveryone.com/logo512.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: '@Everyone - Innovar no es complicar. Es conectar.' },
      {
        name: 'twitter:description',
        content:
          'En @Everyone hacemos apps y contenido tech para humanos normales. Sin humo. Sin postureo. Con mucho corazón.',
      },
      { name: 'twitter:image', content: 'https://arrobaeveryone.com/logo512.png' },
      {
        name: 'keywords',
        content:
          'apps, tecnología, innovación, contenido tech, desarrollo de apps, aplicaciones móviles, estudio tecnológico, diseño de apps, tecnología humana, @Everyone',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://arrobaeveryone.com' }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: '@Everyone',
          url: 'https://arrobaeveryone.com',
          logo: 'https://arrobaeveryone.com/logo512.png',
          description:
            'Estudio tecnológico que crea apps, experiencias digitales y contenido tech para humanos normales.',
          email: 'contacto@arrobaeveryone.com',
          sameAs: [
            'https://www.youtube.com/@EveryoneChannel.oficial',
            'https://www.twitch.tv/arrobaeveryone',
            'https://github.com/arroba-everyone',
          ],
        }),
      },
    ],
  }),
});

function App() {
  // TODO: Convertir imágenes a WebP
  return (
    <MainLayout>
      <Landing />
      <SecondStep />
      <OurProjects />
      <Chat />
      <YouTube />
    </MainLayout>
  );
}
