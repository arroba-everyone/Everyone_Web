import { Card as AntdCard, type CardProps } from 'antd';
import type { JSX } from 'react';

interface ICard extends CardProps {
  bgColor?: string;
  borderRadius?: string | number;
  width?: string | number;
  height?: string | number;
  bodySize?: string | number;
}

export const Card = ({
  children,
  bgColor,
  borderRadius,
  width = 'auto',
  height = 'auto',
  bodySize,
  style,
  styles,
  ...rest
}: ICard): JSX.Element => {
  const bodyWidth = bodySize || width;
  const bodyHeight = bodySize || height;

  return (
    <AntdCard
      {...rest}
      style={{
        ...style,
        backgroundColor: bgColor,
        borderRadius,
      }}
      styles={{
        ...styles,
        body: {
          ...styles?.body,
          width: bodyWidth,
          height: bodyHeight,
        },
      }}
    >
      {children}
    </AntdCard>
  );
};
