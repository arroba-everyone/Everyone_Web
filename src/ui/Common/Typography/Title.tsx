import type { IBaseComponent } from '@everyone-web/types/global';
import { Typography } from 'antd';
import type { TitleProps } from 'antd/es/typography/Title';

interface ITitle extends TitleProps {}

export const Title: IBaseComponent<ITitle> = ({ children, color, style, ...props }) => {
  const { Title: AntdTitle } = Typography;

  return (
    <AntdTitle style={{ ...style, color }} {...props}>
      {children}
    </AntdTitle>
  );
};
