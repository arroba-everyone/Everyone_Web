import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Text, Title } from '@everyone-web/ui/Common/Typography';
import { createFileRoute } from '@tanstack/react-router';
import { Avatar, Divider, Space } from 'antd';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Route = createFileRoute('/blog/$id')({
  component: BlogNew,
});

const xd = `
# Consejos IMPRESCINDIBLES para Cuidar y Optimizar tu PS5 Slim (Evita Problemas Comunes)

---

### ![Imagen de ejemplo del blog](https://picsum.photos/64/64) @everyone \`Aprox. 4 minutos · Enero 2025\`

![Imagen de ejemplo del blog](https://picsum.photos/640/360)

---

¿Quieres mantener tu PS5 Slim como nueva y evitar problemas comunes? 🎮  
En este video, te comparto 15 consejos IMPRESCINDIBLES para cuidar y optimizar tu consola. Desde la mejor ubicación hasta trucos de limpieza y gestión del calor, todo lo que necesitas saber está aquí.  
¡Dale play y cuida tu PS5!  

🛒 Compra la PS5 aquí (Ayudas al canal): Amazon

📢 Únete al servidor de Discord de la comunidad: \`/discord\`

⏱ Timestamps:  

00:00 – Intro  
00:39 – Agradecimientos  
02:08 – Tip 1: ¿Dónde colocar tu PS5?  
04:38 – Tip 2: ¿Cómo se refrigera la PS5?  
05:45 – Tip 3: Cuidado con los objetos que rodean la PS5  
06:24 – Tip 4: Atención con las obstrucciones  
06:59 – Tip 5: Precaución con los accesorios de PS5  
07:58 – Tip 6: Mantén cerrada la tapa del SSD  
09:12 – Tip 7: Descanso en sesiones prolongadas  
09:34 – Tip 8: No llenes el disco interno  
10:34 – Tip 9: Protege tu consola al conectarla a la corriente  
13:18 – Tip 10: Limpieza y protección contra el polvo  

🔖 Tags:

#PS5Slim #CuidadoConsolas #GamingTips #PS5 #PlayStation5 #Videojuegos
`;

function BlogNew() {
  return (
    <MainLayout>
      <Flex vertical style={{ marginTop: '110px' }} align="center" justify="center">
        <Flex vertical style={{ width: '80dvw' }} align="center" justify="center" gap={16}>
          <Markdown
            remarkPlugins={[[remarkGfm]]}
            components={{
              h1: ({ node, ...props }) => <Title level={1} {...props} />,
              h2: ({ node, ...props }) => <Title level={2} {...props} />,
              h3: ({ node, ...props }) => {
                return node?.children.length === 1 ? (
                  <Title level={3} {...props} />
                ) : (
                  <Flex justify="center" align="center" gap={16} {...props}>
                    {props.children?.map((child, index) => {
                      return typeof child === 'string' ? (
                        <Title key={index} level={3}>
                          {child}
                        </Title>
                      ) : child.type === 'code' ? (
                        <Space size="large">
                          {child.props.children
                            .split(/(·)/)
                            .map((p: string) => p.trim())
                            .filter((p: string) => p !== '')
                            .map((c: string, i: string) => (
                              <Title key={i} level={4} type="secondary">
                                {c}
                              </Title>
                            ))}
                        </Space>
                      ) : child.props.src ? (
                        <Avatar key={index} size={64} shape="circle" {...child.props} />
                      ) : (
                        child
                      );
                    })}
                  </Flex>
                );
              },
              p: ({ node, ...props }) => {
                return <Text {...props} />;
              },
              img: ({ node, ...props }) => <img style={{ maxWidth: '100%' }} {...props} />,
              hr: ({ node, ...props }) => (
                <Flex style={{ width: '80dvw' }}>
                  <Divider style={{ borderColor: 'var(--text-color)' }} {...props} />
                </Flex>
              ),
            }}
          >
            {xd}
          </Markdown>
        </Flex>
      </Flex>
    </MainLayout>
  );
}
