import styles from '@everyone-web/css/index.module.css';
import movilLanding from '@everyone-web/assets/movilLanding.png';
import { Link } from '@tanstack/react-router';
import { cn } from '@everyone-web/libs/utils';
import { Button } from '@everyone-web/ui/button';

export const Landing = () => {
  return (
    <div className="w-full lg:h-screen py-10 lg:py-8 px-4">
      <div
        className={cn(
          'w-full h-full flex items-center justify-center',
          'rounded-4xl bg-cover',
          'flex-col gap-12 px-10 py-20 md:px-12 md:py-8 lg:p-0',
          'lg:flex-row lg:gap-0',
          styles.landing
        )}
      >
        <div
          className={cn(
            `flex flex-col gap-7 pt-8 lg:pt-0 lg:px-21 xs:text-center items-center lg:items-start`
          )}
        >
          <h1 className="font-bold text-xl lg:text-7xl w-fit">
            Innovar no es complicar. Es conectar.
          </h1>

          <h2 className={cn('text-md lg:text-4xl')}>
            En @Everyone hacemos apps y contenido tech para humanos normales. Sin humo. Sin
            postureo. Con mucho corazón.
          </h2>

          <div className={cn('flex flex-col gap-3 w-full', 'lg:flex-row lg:gap-2')}>
            <Button className="rounded-full" size={'lg'}>
              Explorar
            </Button>

            <Button
              className="rounded-full border border-primary text-primary"
              size={'lg'}
              variant="ghost"
            >
              <Link to="/contact" className={true ? 'w-full' : undefined}>
                Escríbenos
              </Link>
            </Button>
          </div>
        </div>

        <img
          src={movilLanding}
          alt="Móvil landing page"
          className={`${true ? 'w-62.5 h-125' : true ? 'w-87.5 h-175' : 'w-100 h-200'} object-contain`}
        />
      </div>
    </div>
  );
};
