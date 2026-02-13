import { Profile } from '@everyone-web/components/Profile/Profile';
import { cn } from '@everyone-web/libs/utils';
import juanAvatar from '@everyone-web/assets/juanAvatar.webp';
import ireneAvatar from '@everyone-web/assets/ireneAvatar.webp';

export const ThirdPage = () => {
  const profiles = [
    {
      name: 'Juan Ferrera Sala',
      imageUrl: juanAvatar,
      position: 'CEO · Diseñador de Interfaces · Desarrollador iOS',
      bio: 'Diseña cómo se ve y cómo se siente @Everyone. Se encarga de las interfaces, la experiencia y el desarrollo de las apps para el ecosistema Apple 🍏. También coordina el rumbo del equipo y da forma a la identidad visual de cada proyecto. Cree que la tecnología debe ser útil, bonita y, sobre todo, humana.',
      links: {
        github: 'https://github.com/Tostyfis360',
        linkedin: 'https://www.linkedin.com/in/juan-ferrera-sala-6264401a7/',
      },
    },
    {
      name: 'Pablo Enguix Llopis',
      imageUrl: 'https://avatars.githubusercontent.com/u/56578000?v=4',
      position: 'CTO · Desarrollador Web · Backend & Android',
      bio: 'Guardián del “que todo funcione”. Programa la base tecnológica de los proyectos: desde el backend hasta las aplicaciones Android y la web. Combina lógica, estructura y café ☕ para convertir las ideas en sistemas estables y elegantes.',
      links: {
        github: 'https://github.com/PabloEnguix09',
        linkedin: 'https://www.linkedin.com/in/pablo-enguix-llopis-1b2986193/',
      },
    },
    {
      name: 'Irene Correll Canchal',
      imageUrl: ireneAvatar,
      position: 'Comunicación & Diseño Visual · Marketing Digital',
      bio: 'Es la voz y la mirada de @Everyone. Se encarga de la identidad visual, las redes sociales y las campañas que hacen que cada proyecto respire coherencia y emoción. Tiene un ojo afinado para el detalle y un gusto impecable por la estética. Convierte ideas técnicas en historias que cualquiera puede disfrutar.',
      links: {
        instagram: 'https://instagram.com/orden.studio',
        linkedin: 'https://www.linkedin.com/in/lrene-corell-323996279/',
      },
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-col items-center',
        'px-6 py-10 tablet-lg:py-11 laptop:py-12',
        'gap-16 md:gap-20 tablet-lg:gap-24 laptop:gap-26 laptop-lg:gap-29 desktop:gap-32'
      )}
    >
      {profiles.map((profile, index) => (
        <Profile {...profile} key={index} reverse={index % 2 === 1} />
      ))}
    </div>
  );
};
