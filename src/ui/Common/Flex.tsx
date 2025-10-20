import type { IBaseComponent } from '@everyone-web/types/global';
import { Flex as AntdFlex, type FlexProps } from 'antd';

interface IFlexProps extends FlexProps {}

export const Flex: IBaseComponent<IFlexProps> = ({ children, ...props }) => {
  return <AntdFlex {...props}>{children}</AntdFlex>;
};
