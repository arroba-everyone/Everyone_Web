import { Message } from '@everyone-web/components/Message/Message';
import juanAvatar from '@everyone-web/assets/juanAvatar.webp';
import ireneAvatar from '@everyone-web/assets/ireneAvatar.webp';

import everyoneStreet from '@everyone-web/assets/everyoneStreet.webp';

export const Chat = () => {
  const messages = [
    {
      key: 1,
      sender: 'Irene - Marketing & CM',
      imageUrl: ireneAvatar,
      children:
        'Si ves que todo lo que hacemos se ve bien, suena bien y da ganas de compartirlo… probablemente haya pasado por mis manos. 💅Campañas, redes y diseño con cerebro (y un poquito de perfume).',
    },
    {
      key: 2,
      sender: 'Juan - CEO & iOS Developer',
      imageUrl: juanAvatar,
      sent: true,
      children:
        'Soy quien da forma a las interfaces y quien las convierte en apps para el ecosistema Apple 🍏. Me aseguro de que todo funcione con fluidez y tenga ese toque que hace que la tecnología se sienta cercana. Ah, y sí… en el setup de la oficina hay más LEGO del que admitiría en público 🧱😅.',
    },
    {
      key: 3,
      sender: 'Pablo - CTO & Fullstack Developer',
      imageUrl: 'https://avatars.githubusercontent.com/u/56578000?v=4',
      children:
        'Yo soy el que se encarga de que todo lo que soñamos realmente funcione ⚙️. Desarrollo la parte web, las apps Android y toda la magia del backend. Y si algo explota, probablemente fue antes de mi tercer café ☕️😆.',
    },
    {
      key: 4,
      sender: 'Juan - CEO & iOS Developer',
      imageUrl: juanAvatar,
      sent: true,
      children:
        'Lo bueno es que aquí nadie trabaja solo 💪. Cada proyecto sale adelante porque mezclamos ideas, código y mucha cafeína. Y eso se nota en el resultado.',
    },
    {
      key: 5,
      sender: 'Irene - Marketing & CM',
      imageUrl: ireneAvatar,
      children:
        'Exacto 💬. Somos distintos, pero cuando juntamos diseño, desarrollo y creatividad, pasan cosas guays. Y eso, al final, es lo que nos encanta hacer todos los días 💛.',
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row items-center my-8">
      <div className="flex flex-col lg:flex-row justify-around items-center h-fit gap-4">
        <div className="flex w-11/12 lg:w-5/12 flex-col gap-4">
          {messages.map(({ key, ...message }) => (
            <Message key={key} {...message} />
          ))}
        </div>

        {/*<img className="col-span-3 h-full" src={everyoneStreet} alt="Móvil sección 3" /> */}
      </div>
    </div>
  );
};
