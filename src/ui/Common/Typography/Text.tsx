import type { IBaseComponent } from '@everyone-web/types/global';
import { Typography } from 'antd';
import type { TitleProps } from 'antd/es/typography/Title';

interface IText extends TitleProps {}

export const Text: IBaseComponent<IText> = ({ children, ...props }) => {
  const { Text: AntdText } = Typography;

  return <AntdText {...props}>{children}</AntdText>;
};
