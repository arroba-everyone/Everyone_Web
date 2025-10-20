import type { IBaseComponent } from '@everyone-web/types/global';
import { Button as AntdButton, type ButtonProps } from 'antd';

interface IButtonProps extends ButtonProps {}

export const Button: IBaseComponent<IButtonProps> = ({ children, ...props }) => {
  return <AntdButton {...props}>{children}</AntdButton>;
};
