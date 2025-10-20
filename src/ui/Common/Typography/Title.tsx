import type { IBaseComponent } from '@everyone-web/types/global';
import { Typography } from 'antd';
import type { TitleProps } from 'antd/es/typography/Title';

interface ITitle extends TitleProps {}

export const Title: IBaseComponent<ITitle> = ({ children, ...props }) => {
  const { Title: AntdTitle } = Typography;

  return <AntdTitle {...props}>{children}</AntdTitle>;
};
