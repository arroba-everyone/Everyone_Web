import { NewsItem } from '@everyone-web/components/Blog/NewsItem';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { getFiles } from '@everyone-web/services/getFiles';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/blog/')({
  component: Blog,
});

function Blog() {
  const mockNews = [
    {
      id: '1',
      thumbnail: 'https://placehold.co/480x272',
      author: 'John Doe',
      date: new Date(),
      title:
        'Beyerdynamic DT990 Pro (80Ω) Review 🎧 | ¿Los Mejores Auriculares para Jugar y Crear Contenido?',
    },
    {
      id: '2',
      thumbnail: 'https://placehold.co/480x272',
      author: 'Jane Smith',
      date: new Date('2023-10-15'),
      title: 'Sample News Title 2',
    },
    {
      id: '3',
      thumbnail: 'https://placehold.co/480x272',
      author: 'Jane Smith',
      date: new Date('2023-10-15'),
      title: 'Sample News Title 2',
    },
    {
      id: '4',
      thumbnail: 'https://placehold.co/480x272',
      author: 'Jane Smith',
      date: new Date('2023-10-15'),
      title: 'Sample News Title 2',
    },
    {
      id: '5',
      thumbnail: 'https://placehold.co/480x272',
      author: 'Jane Smith',
      date: new Date('2023-10-15'),
      title: 'Sample News Title 2',
    },
    {
      id: '6',
      thumbnail: 'https://placehold.co/480x272',
      author: 'Jane Smith',
      date: new Date('2023-10-15'),
      title: 'Sample News Title 2',
    },
    {
      id: '7',
      thumbnail: 'https://placehold.co/480x272',
      author: 'Jane Smith',
      date: new Date('2023-10-15'),
      title: 'Sample News Title 2',
    },
    {
      id: '8',
      thumbnail: 'https://placehold.co/480x272',
      author: 'Jane Smith',
      date: new Date('2023-10-15'),
      title: 'Sample News Title 2',
    },
    {
      id: '9',
      thumbnail: 'https://placehold.co/480x272',
      author: 'Jane Smith',
      date: new Date('2023-10-15'),
      title: 'Sample News Title 2',
    },
    {
      id: '10',
      thumbnail: 'https://placehold.co/480x272',
      author: 'Jane Smith',
      date: new Date('2023-10-15'),
      title: 'Sample News Title 2',
    },
  ];

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <MainLayout>
      <Flex justify="center" fullWidth>
        <Flex
          vertical
          gap={16}
          style={{ width: '95dvw', minHeight: '100dvh', paddingTop: '130px' }}
        >
          {mockNews.map((news, index) => (
            <NewsItem key={index} {...news} />
          ))}
        </Flex>
      </Flex>
    </MainLayout>
  );
}
