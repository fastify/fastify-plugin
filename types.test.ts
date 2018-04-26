import * as fp from '../fastify-plugin';
import * as fastify from 'fastify';

export const testPlugin = fp(function (fastify: fastify.FastifyInstance, options: {}, next: fp.nextCallback) {
  fastify.decorate('utility', () => { })
  next();
}, '>=1');

export const testPluginWithAsync = fp(async function (fastify: fastify.FastifyInstance) {
  fastify.decorate('utility', () => { })
}, {
    fastify: '>=1',
    name: 'TestPlugin',
    decorators: {
      request: ['log']
    }
  });
