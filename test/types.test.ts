import * as fp from '../fastify-plugin';
import * as fastify from 'fastify';

export const testPlugin = fp(
  function (fastify: fastify.FastifyInstance, options: {}, next: fp.nextCallback) {
    fastify.decorate('utility', () => { })
    next();
  },
  '>=1'
);

export const testPluginWithCallback = fp(
  function (fastify, options, next) {
    fastify.decorate('utility', () => { })
    return;
  },
  {},
  (err) => {}
)

export const testPluginWithAsync = fp(
  async function (fastify: fastify.FastifyInstance) {
    fastify.decorate('utility', () => { })
  },
  {
    fastify: '>=1',
    name: 'TestPlugin',
    decorators: {
      request: ['log']
    }
  }
);

const server = fastify()

server.register(testPlugin) // register expects a fastify.Plugin
server.register(testPluginWithCallback) // test fastify.Plugin's gerneric typings
