import Fastify from 'fastify';
import schemas from './schemas';
import router from './routes';
import dataAccessors from './dataAccessors';

(() => {
  const app = Fastify({
    ajv: {
      customOptions: {
        coerceTypes: 'array',
        strictSchema: true,
        messages: true,
      },
    },
  });

  schemas(app);
  app.register(dataAccessors);
  app.register(router);

  const host = process.env.HOST ?? '0.0.0.0';
  const port = process.env.PORT ?? 3000; // default port to listen

  // start the fastify server
  app.listen({ host, port: Number(port) }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.info(`Server started at http://${host}:${port}`);
  });
})();
