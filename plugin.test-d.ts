import fp from './plugin';
import fastify, { FastifyPlugin } from 'fastify';
import { expectError } from 'tsd'

export interface TestOptions {
  customNumber: number
}

export const testPluginWithOptions: FastifyPlugin<TestOptions> = fp(
  function (fastify, options, _next) {
    fastify.decorate('utility', () => options.customNumber)
  },
  '>=1'
);

export const testPluginWithCallback: FastifyPlugin<TestOptions> = fp(
  function (fastify, _options, next) {
    fastify.decorate('utility', () => { })
    next();
    return;
  },
  { customNumber: 1 },
)

export const testPluginWithAsync = fp<TestOptions>(
  async function (fastify, _options) {
    fastify.decorate('utility', () => { })
  },
  {
    customNumber: 2,
    fastify: '>=1',
    name: 'TestPlugin',
    decorators: {
      request: ['log']
    }
  }
);

// Register with HTTP
const server = fastify()

server.register(testPluginWithOptions) // register expects a FastifyPlugin
server.register(testPluginWithCallback)
server.register(testPluginWithAsync)

// Register with HTTP2
const serverWithHttp2 = fastify({ http2: true });

serverWithHttp2.register(testPluginWithOptions) // register expects a FastifyPlugin
serverWithHttp2.register(testPluginWithCallback)
expectError(serverWithHttp2.register({ no: 'plugin' })) // register only accept valid plugins
expectError(serverWithHttp2.register(testPluginWithAsync, { logLevel: 'invalid-log-level' })) // register options need to be valid built in fastify options
expectError(serverWithHttp2.register(testPluginWithAsync, { customNumber: 'not-a-number' })) // or valid custom options defined by plugin itself
