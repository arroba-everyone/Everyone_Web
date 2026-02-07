import styles from '@everyone-web/css/index.module.css';
import landingPhone from '@everyone-web/assets/landingPhone.png';
import { Link } from '@tanstack/react-router';
import { cn } from '@everyone-web/libs/utils';
import { Button } from '@everyone-web/ui/button';

export const Landing = () => {
  return (
    <div className="w-full tablet-lg:h-[95vh] lg:h-screen py-10 tablet-lg:py-8 px-4">
      <div
        className={cn(
          'w-full h-full flex items-center justify-center',
          'rounded-4xl bg-cover',
          'flex-col gap-12 px-10 py-20 md:px-12 md:py-8 tablet-lg:px-8 tablet-lg:py-10',
          'laptop:p-12 laptop-lg:p-16 desktop:p-0',
          'lg:flex-row lg:gap-0',
          styles.landing
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-5 tablet-lg:gap-6 laptop:gap-7',
            'pt-8 lg:pt-0',
            'lg:px-16 laptop:px-18 laptop-lg:px-20 desktop:px-21',
            'xs:text-center items-center lg:items-start'
          )}
        >
          <h1 className="font-bold text-xl md:text-3xl tablet-lg:text-4xl laptop:text-5xl laptop-lg:text-6xl desktop:text-7xl w-fit">
            Innovar no es complicar. Es conectar.
          </h1>

          <h2
            className={cn(
              'text-md md:text-lg tablet-lg:text-xl laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl'
            )}
          >
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
          src={landingPhone}
          alt="Móvil landing page"
          className="w-62.5 h-125 tablet-lg:w-70 tablet-lg:h-140 laptop:w-75 laptop:h-150 laptop-lg:w-80 laptop-lg:h-160 desktop:w-87.5 desktop:h-175 object-contain"
        />
      </div>
    </div>
  );
};
