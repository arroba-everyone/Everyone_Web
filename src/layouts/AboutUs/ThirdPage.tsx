import { Profile } from '@everyone-web/components/Profile/Profile';
import { Flex } from '@everyone-web/ui/Common/Flex';

export const ThirdPage = () => {
  const profiles = [
    {
      name: 'Juan Ferrera Sala',
      imageUrl: 'https://avatars.githubusercontent.com/u/52204238?v=4',
      position: 'CEO · iOS Developer',
      bio: 'Apasionado por la tecnología y el desarrollo web. Siempre en busca de nuevos desafíos y aprendizajes.',
      links: { github: '', instagram: '' },
    },
    {
      name: 'Pablo Enguix Llopis',
      imageUrl: 'https://avatars.githubusercontent.com/u/52204239?v=4',
      position: 'CTO · Fullstack Developer',
      bio: 'Desarrollador fullstack con experiencia en múltiples tecnologías. Me encanta crear soluciones innovadoras.',
      links: { github: '', instagram: '' },
    },
    {
      name: 'Irene Correll',
      imageUrl: 'https://avatars.githubusercontent.com/u/52204240?v=4',
      position: 'Community Manager',
      bio: 'Especialista en gestión de comunidades online. Me apasiona conectar personas y construir relaciones sólidas.',
      links: { instagram: '' },
    },
  ];

  return (
    <Flex style={{ width: '90dvw' }} vertical gap={32} align="center">
      {profiles.map((profile, index) => (
        <Profile {...profile} key={index} />
      ))}
    </Flex>
  );
};
