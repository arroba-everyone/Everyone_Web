import { Flex } from '@everyone-web/ui/Common/Flex';
import { Text, Title } from '@everyone-web/ui/Common/Typography';
import { Avatar, Popover } from 'antd';
import type { JSX, ReactNode } from 'react';

interface IMessageProps {
  children: ReactNode;
  sender: ReactNode;
  gap: number;
  sent?: boolean;
}

export const Message = ({ children, sender, gap, sent = false }: IMessageProps): JSX.Element => {
  return (
    <Flex justify={sent ? 'end' : 'start'} align="center" style={{ marginBottom: gap }}>
      <Popover
        open
        zIndex={0}
        placement={sent ? 'leftBottom' : 'rightBottom'}
        color={sent ? '#84cc16' : '#a78bfa'}
        title={
          <Flex vertical gap={8} style={{ width: '25dvw' }}>
            <Title color="var(--color-bg)" level={4} style={{ margin: 0 }}>
              {sender}
            </Title>
            <Text color="var(--color-bg)">{children}</Text>
          </Flex>
        }
      >
        <Avatar
          size={50}
          style={{
            backgroundColor: '#d9d9d9',
          }}
        />
      </Popover>
    </Flex>
  );
};
