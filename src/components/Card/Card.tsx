import { Card as AntdCard, type CardProps } from 'antd';
import type { JSX } from 'react';

interface ICard extends CardProps {}

export const Card = ({ children, ...rest }: ICard): JSX.Element => {
  return <AntdCard {...rest}>{children}</AntdCard>;
};
