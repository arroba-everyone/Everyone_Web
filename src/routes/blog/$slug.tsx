import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { useGetPostBySlug } from '@everyone-web/services/getPostBySlug';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Text, Title } from '@everyone-web/ui/Common/Typography';
import { createFileRoute } from '@tanstack/react-router';
import { Avatar, Divider, Space } from 'antd';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Route = createFileRoute('/blog/$slug')({
  component: BlogNew,
});

function BlogNew() {
  const { slug } = Route.useParams();

  const { data, isLoading } = useGetPostBySlug(slug);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                    {Array.isArray(props.children) &&
                      props.children?.map((child, index) => {
                        return typeof child === 'string' ? (
                          <Title key={index} level={3}>
                            {child}
                          </Title>
                        ) : child.type === 'code' ? (
                          <Space key={index} size="large">
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
            {data}
          </Markdown>
        </Flex>
      </Flex>
    </MainLayout>
  );
}
