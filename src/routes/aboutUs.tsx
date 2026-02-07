import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { FirstPage } from '@everyone-web/layouts/AboutUs/FirstPage';
import { SecondPage } from '@everyone-web/layouts/AboutUs/SecondPage';
import { ThirdPage } from '@everyone-web/layouts/AboutUs/ThirdPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/aboutUs')({
  component: AboutUs,
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
