import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { FirstPage } from '@everyone-web/layouts/AboutUs/FirstPage';
import { SecondPage } from '@everyone-web/layouts/AboutUs/SecondPage';
import { ThirdPage } from '@everyone-web/layouts/AboutUs/ThirdPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/aboutUs')({
  component: AboutUs,
  head: () => ({
    meta: [
      { title: 'Sobre Nosotros - @Everyone' },
      {
        name: 'description',
        content:
          'Somos un estudio donde la creatividad y la tecnología trabajan codo con codo. Creamos apps, experiencias digitales y contenido con propósito.',
      },
      { property: 'og:title', content: 'Sobre Nosotros - @Everyone' },
      {
        property: 'og:description',
        content:
          'Somos un estudio donde la creatividad y la tecnología trabajan codo con codo. Creamos apps, experiencias digitales y contenido con propósito.',
      },
      { property: 'og:url', content: 'https://arrobaeveryone.com/aboutUs' },
      { property: 'og:image', content: 'https://arrobaeveryone.com/logo512.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: 'Sobre Nosotros - @Everyone' },
      {
        name: 'twitter:description',
        content:
          'Somos un estudio donde la creatividad y la tecnología trabajan codo con codo. Creamos apps, experiencias digitales y contenido con propósito.',
      },
      { name: 'twitter:image', content: 'https://arrobaeveryone.com/logo512.png' },
    ],
    links: [{ rel: 'canonical', href: 'https://arrobaeveryone.com/aboutUs' }],
  }),
});

function AboutUs() {
  return (
    <MainLayout>
      <FirstPage />
      <SecondPage />
      <ThirdPage />
    </MainLayout>
  );
}
