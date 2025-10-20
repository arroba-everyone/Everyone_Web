import { theme as AntdTheme, type ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  algorithm: [AntdTheme.darkAlgorithm],
  token: {
    colorPrimary: '#87e300',
    colorInfo: '#87e300',
  },
  components: {
    Layout: {
      headerBg: '#0A0A0A',
    },
    Button: {
      primaryColor: '#0A0A0A',
    },
    Typography: {
      colorTextHeading: '#FFFAFA',
    },
  },
};
