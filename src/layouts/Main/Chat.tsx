import { Message } from '@everyone-web/components/Message/Message';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Image } from 'antd';
import movilSeccion3 from '@everyone-web/assets/movilSeccion3.png';

export const Chat = () => {
  const messages = [
    {
      key: 1,
      sender: 'Irene Corell - CM',
      gap: 80,
      children:
        'Oye, todo esto está muy bien y todo, pero, ¿cuándo vamos a salir nosotros? Parece que estamos soltando la chapa del siglo aquí...',
    },
    {
      key: 2,
      sender: 'Juan Ferrera - Developer',
      sent: true,
      gap: 60,
      children:
        '¿Nos estamos pegando el currazo con todo lo que tenemos entre manos y encima te quejas? Otro mes que no cobras...',
    },
    {
      key: 3,
      sender: 'Irene Corell - CM',
      gap: 80,
      children: '🎙️QUIERO MI BO-CADILLO!! QUIERO MI BO-CADILLO!!',
    },
    {
      key: 4,
      sender: 'Juan Ferrera - Developer',
      sent: true,
      gap: 60,
      children: 'Joder cómo está el personal... 🤦‍♂️ Bueno gente, ya nos conocéis algo más',
    },
    {
      key: 5,
      sender: 'Irene Corell - CM',
      gap: 0,
      children: '¿A quién le hablas? ¿Estás bien? ¿Te has tomado las pastillas?',
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
