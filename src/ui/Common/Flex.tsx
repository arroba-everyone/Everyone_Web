import type { IBaseComponent } from '@everyone-web/types/global';
import { Flex as AntdFlex, type FlexProps } from 'antd';

interface IFlexProps extends FlexProps {
  fullWidth?: boolean;
  fullHeight?: boolean;
  fullScreen?: boolean;
}

export const Flex: IBaseComponent<IFlexProps> = ({
  children,
  style,
  fullWidth,
  fullHeight,
  fullScreen,
  ...props
}) => {
  const width = fullWidth ? '100%' : fullScreen ? '99dvw' : undefined;
  const height = fullHeight ? '100%' : fullScreen ? '100dvh' : undefined;
  return (
    <AntdFlex {...props} style={{ width, height, ...style }}>
      {children}
    </AntdFlex>
  );
};
