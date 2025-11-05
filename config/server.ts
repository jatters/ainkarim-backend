import cronTask from './cron-tasks';

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  proxy: {koa: true},    
  cron: {
    enabled: true,
    tasks: cronTask,
  },
  app: {
    keys: env.array('APP_KEYS'),
  },  
});
