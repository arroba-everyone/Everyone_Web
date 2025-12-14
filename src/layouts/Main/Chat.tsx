import { Message } from '@everyone-web/components/Message/Message';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Image } from 'antd';
import movilSeccion3 from '@everyone-web/assets/movilSeccion3.png';

export const Chat = () => {
  const messages = [
    {
      key: 1,
      sender: 'Irene - Marketing & CM',
      gap: 140,
      children:
        'Si ves que todo lo que hacemos se ve bien, suena bien y da ganas de compartirlo… probablemente haya pasado por mis manos. 💅Campañas, redes y diseño con cerebro (y un poquito de perfume).',
    },
    {
      key: 2,
      sender: 'Juan - CEO & iOS Developer',
      sent: true,
      gap: 120,
      children:
        'Soy quien da forma a las interfaces y quien las convierte en apps para el ecosistema Apple 🍏. Me aseguro de que todo funcione con fluidez y tenga ese toque que hace que la tecnología se sienta cercana. Ah, y sí… en el setup de la oficina hay más LEGO del que admitiría en público 🧱😅.',
    },
    {
      key: 3,
      sender: 'Pablo - CTO & Fullstack Developer',
      gap: 100,
      children:
        'Yo soy el que se encarga de que todo lo que soñamos realmente funcione ⚙️. Desarrollo la parte web, las apps Android y toda la magia del backend. Y si algo explota, probablemente fue antes de mi tercer café ☕️😆.',
    },
    {
      key: 4,
      sender: 'Juan - CEO & iOS Developer',
      sent: true,
      gap: 100,
      children:
        'Lo bueno es que aquí nadie trabaja solo 💪. Cada proyecto sale adelante porque mezclamos ideas, código y mucha cafeína. Y eso se nota en el resultado.',
    },
    {
      key: 5,
      sender: 'Irene - Marketing & CM',
      gap: 0,
      children:
        'Exacto 💬. Somos distintos, pero cuando juntamos diseño, desarrollo y creatividad, pasan cosas guays. Y eso, al final, es lo que nos encanta hacer todos los días 💛.',
    },
  ];
  return (
    <Flex fullScreen align="center" justify="space-around">
      <Flex vertical style={{ width: '45dvw' }}>
        {messages.map(({ key, ...message }) => (
          <Message key={key} {...message} />
        ))}
      </Flex>
      <Image src={movilSeccion3} preview={false} alt="Móvil sección 3" />
    </Flex>
  );
};
