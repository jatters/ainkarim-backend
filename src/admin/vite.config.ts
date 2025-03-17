import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    server: {
      allowedHosts: ['manager.ainkarim.co'],
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  });
};
