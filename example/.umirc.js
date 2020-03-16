import { join } from 'path';

export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        fastClick: true,
        routes: {
          exclude: [/models\//, /components\//, /\/*\.styl\.d\.ts/],
        },
        pwa: {
          workboxOptions: {
            importWorkboxFrom: 'local',
            include: [],
          },
        },
      },
    ],
    [
      join(__dirname, '..', require('../package').main || 'index.js'),
      { enable: true }
    ],
  ],
  history: 'hash'
}
