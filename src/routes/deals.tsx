import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { DealsGrid } from '@everyone-web/components/deals/DealsGrid';
import { getPublicDealsFn } from '@everyone-web/services/deals';

export const Route = createFileRoute('/deals')({
  loader: () => getPublicDealsFn(),
  component: DealsPage,
  head: () => ({
    meta: [
      { title: 'Ofertas - @Everyone' },
      {
        name: 'description',
        content:
          'Las mejores ofertas y chollos tecnológicos seleccionados para la comunidad @Everyone.',
      },
      { property: 'og:title', content: 'Ofertas - @Everyone' },
      {
        property: 'og:description',
        content:
          'Las mejores ofertas y chollos tecnológicos seleccionados para la comunidad @Everyone.',
      },
      { property: 'og:url', content: 'https://arrobaeveryone.com/deals' },
    ],
  }),
});

function DealsPage() {
  const { deals, lockedDeal } = Route.useLoaderData();

  return (
    <MainLayout tone="light">
      <div className="theme-light bg-cream flex justify-center w-full pt-32 md:pt-36 laptop:pt-40 px-4 pb-16 min-h-screen">
        <div className="flex flex-col gap-8 max-w-7xl w-full">
          <div className="flex flex-col items-start gap-3">
            <span className="rounded-full bg-lime-tint text-lime-deep px-4 py-1.5 text-sm font-bold">
              Comunidad
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink">
              Ofertas
            </h1>
            <p className="text-ink-soft text-lg">
              Los mejores chollos seleccionados para vosotros.
            </p>
          </div>

          {deals.length === 0 && lockedDeal === null ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No hay ofertas activas ahora mismo. Vuelve pronto.
              </p>
            </div>
          ) : (
            <DealsGrid deals={deals} lockedDeal={lockedDeal} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
