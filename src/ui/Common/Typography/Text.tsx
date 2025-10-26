import type { IBaseComponent } from '@everyone-web/types/global';
import { Typography } from 'antd';
import type { TextProps } from 'antd/es/typography/Text';

interface IText extends TextProps {
  color?: string;
}

export const Text: IBaseComponent<IText> = ({ children, color, style, ...props }) => {
  const { Text: AntdText } = Typography;

  return (
    <AntdText style={{ ...style, color }} {...props}>
      {children}
    </AntdText>
  );
};
