import type { ReactNode } from 'react';

export interface IBaseComponentProps {
  children?: ReactNode;
}

export type IBaseComponent<T = IBaseComponentProps> = (props: T) => React.JSX.Element;
