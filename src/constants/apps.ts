// apps.ts — catálogo de las apps propias que se muestran en /projects.
//
// Los textos están tomados de las fichas publicadas en App Store y Google
// Play, no de borradores: si una ficha cambia, se actualiza aquí.
// Para añadir una app: nueva carpeta de capturas en src/assets/projects/<id>/
// (WebP de 720 px de ancho, nombradas 01.webp, 02.webp…), una entrada en
// APPS y un color de escenario en AppShowcase.

export type AppId = 'spotter' | 'inedito' | 'loop';

export interface IAppScreenshot {
  src: string;
  /** Texto del póster, para lectores de pantalla. */
  alt: string;
}

export interface IAppProject {
  id: AppId;
  name: string;
  /** Frase corta bajo el nombre. */
  tagline: string;
  /** Párrafos de presentación. */
  description: readonly string[];
  /** Puntos fuertes, en lista. Máximo 4: más empuja los botones fuera de pantalla. */
  highlights: readonly string[];
  /** Condiciones de uso que conviene saber antes de descargar (edad, países…). */
  note?: string;
  /** Ruta de la política de privacidad, servida como HTML estático desde public/. */
  privacyHref: string;
  stores: {
    ios: string;
    android: string;
  };
  screenshots: readonly IAppScreenshot[];
}

/**
 * Las capturas se cargan por carpeta y se ordenan por nombre de fichero, de
 * modo que añadir o reordenar capturas es renombrar ficheros, no tocar código.
 */
function loadScreenshots(
  modules: Record<string, string>,
  alts: readonly string[]
): IAppScreenshot[] {
  return Object.keys(modules)
    .sort()
    .map((path, index) => ({
      src: modules[path] as string,
      alt: alts[index] ?? '',
    }));
}

const spotterImages = import.meta.glob<string>('../assets/projects/spotter/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
});
const ineditoImages = import.meta.glob<string>('../assets/projects/inedito/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
});
const loopImages = import.meta.glob<string>('../assets/projects/loop/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
});

export const APPS: readonly IAppProject[] = [
  {
    id: 'spotter',
    name: 'Spotter',
    tagline: 'Encuentra con quién entrenar.',
    description: [
      'Cada día, cinco personas cerca de ti que entrenan lo mismo, con tu horario y tu nivel. Si alguien te encaja, le das un Spot; si te contesta, se abre el chat y a entrenar.',
      'Nadie te escribe sin permiso: quien recibe tu Spot decide si empezáis a hablar.',
    ],
    highlights: [
      'Tu serie diaria de cinco personas cerca de ti',
      'Gimnasio, running, ciclismo, Hyrox y calistenia',
      'Más de 10.000 gimnasios de toda España',
      'Grupos y comunidades para no entrenar nunca solo',
    ],
    note: 'Para mayores de 18 años. De momento, solo en España.',
    privacyHref: '/spotter/privacidad',
    stores: {
      ios: 'https://apps.apple.com/es/app/spotter-entrena-acompa%C3%B1ado/id6755760038',
      android: 'https://play.google.com/store/apps/details?id=com.spotter.com',
    },
    screenshots: loadScreenshots(spotterImages, [
      'Encuentra con quién entrenar: cada día, cinco personas cerca de ti, con tu horario y tu nivel.',
      'Da un Spot y quedad: el perfil de una persona con el botón «Dar un Spot».',
      'Nadie te escribe sin permiso: quien recibe tu Spot decide si empezáis a hablar.',
      'Contestas y hay plan: un chat para quedar en tu gimnasio, a tu hora.',
      'Primero un Spot, luego tu grupo: tus Spots, chats y grupos en un solo sitio.',
    ]),
  },
  {
    id: 'inedito',
    name: 'Inédito',
    tagline: 'Dispara a ciegas. Descubre más tarde.',
    description: [
      'Una cámara desechable para tu móvil: sin pantalla, sin filtros en vivo, sin inmediatez. Haces tus 27 fotos a ciegas y no ves ni una hasta que terminas el carrete y pasan 24 horas reales de revelado.',
      'Entonces aparecen con alma de película: grano, luz cálida y la fecha quemada en la esquina.',
    ],
    highlights: [
      'Carrete de 27 fotos, sin pantalla',
      'Revelado real de 24 horas, con aviso cuando esté listo',
      'Tres carretes: Kodak cálido, blanco y negro y un look frío',
      '100 % offline: sin cuentas y cero datos recogidos',
    ],
    privacyHref: '/inedito/privacidad.html',
    stores: {
      ios: 'https://apps.apple.com/es/app/in%C3%A9dito-c%C3%A1mara-anal%C3%B3gica/id6783731687',
      android: 'https://play.google.com/store/apps/details?id=com.everyone.inedito',
    },
    screenshots: loadScreenshots(ineditoImages, [
      'Una cámara sin pantalla: disparas a ciegas, como con una desechable.',
      'Con alma de película: grano, luz cálida y la fecha quemada en la esquina.',
      'Fácil desde el primer disparo: una guía rápida para empezar a capturar momentos.',
      'Espera el revelado: 24 horas reales, y te avisamos cuando esté listo.',
      'Tres carretes, tres miradas: Gold 400, B/N 400 y Azur 200.',
    ]),
  },
  {
    id: 'loop',
    name: 'Loop',
    tagline: 'Tu día a día, en un emoji.',
    description: [
      'La forma más simple de estar al día con tus amigos: sin textos largos, solo emojis. Creas un grupo privado, elegís juntos cuatro emojis que representen vuestro día a día y se los enviáis al grupo de un toque.',
      'Y cuando queráis competir: un minijuego nuevo cada día, rachas y un resumen semanal estilo «Wrapped».',
    ],
    highlights: [
      'Grupos privados, solo con tu gente',
      'Rachas y un reto nuevo cada día en el grupo',
      'Resumen semanal: el más activo, los reyes del juego…',
      'Modo fiesta: juegos para jugar en persona (Impostor y DNI)',
    ],
    privacyHref: '/loop/privacidad.html',
    stores: {
      ios: 'https://apps.apple.com/es/app/loop-tu-d%C3%ADa-en-emojis/id6785017855',
      android: 'https://play.google.com/store/apps/details?id=com.everyone.loop',
    },
    screenshots: loadScreenshots(loopImages, [
      'Tu día a día, en un emoji: cuenta lo que haces sin escribir y tu grupo lo pilla al instante.',
      'Grupos privados con tu gente: cada grupo, su mundo.',
      'Pulsa, envía y listo: cuatro emojis por grupo para contar tu día.',
      'Vuestros emojis, vuestras reglas: decidís qué significa cada uno.',
      'Vuestro Resumen Semanal: el «Wrapped» de vuestro finde.',
      'Quién manda en el grupo: rachas, campeones y estadísticas de la semana.',
      'Pícate con tus amigos: reflejos, memoria y velocidad.',
      'Un reto nuevo cada día: compite con tu grupo en el minijuego del día.',
    ]),
  },
];
