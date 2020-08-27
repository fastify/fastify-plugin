import fp from './plugin';
import fastify, { FastifyPluginCallback, FastifyPluginAsync, FastifyError, FastifyInstance, FastifyPluginOptions } from 'fastify';
import { expectAssignable, expectError } from 'tsd'

interface Options {
  foo: string
}

// Callback

const pluginCallback: FastifyPluginCallback = (fastify, options, next) => { }
expectAssignable<FastifyPluginCallback>(fp(pluginCallback))

const pluginCallbackWithTypes = (fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void): void => { }
expectAssignable<FastifyPluginCallback>(fp(pluginCallbackWithTypes))

expectAssignable<FastifyPluginCallback>(fp((fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void): void => { }))

expectAssignable<FastifyPluginCallback>(fp(pluginCallback, '' ))
expectAssignable<FastifyPluginCallback>(fp(pluginCallback, {
  fastify: '',
  name: '',
  decorators: {
    fastify: [ '' ],
    reply: [ '' ],
    request: [ '' ]
  },
  dependencies: [ '' ]
}))

const pluginCallbackWithOptions: FastifyPluginCallback<Options> = (fastify, options, next) => {
  expectAssignable<string>(options.foo)
}

expectAssignable<FastifyPluginCallback<Options>>(fp(pluginCallbackWithOptions))

// Async

const pluginAsync: FastifyPluginAsync = async (fastify, options) => { }
expectAssignable<FastifyPluginAsync>(fp(pluginAsync))

const pluginAsyncWithTypes = async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => { }
expectAssignable<FastifyPluginAsync>(fp(pluginAsyncWithTypes))

expectAssignable<FastifyPluginAsync>(fp(async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => { }))
expectAssignable<FastifyPluginAsync>(fp(pluginAsync, '' ))
expectAssignable<FastifyPluginAsync>(fp(pluginAsync, {
  fastify: '',
  name: '',
  decorators: {
    fastify: [ '' ],
    reply: [ '' ],
    request: [ '' ]
  },
  dependencies: [ '' ]
}))

const pluginAsyncWithOptions: FastifyPluginAsync<Options> = async (fastify, options) => {
  expectAssignable<string>(options.foo)
}

expectAssignable<FastifyPluginAsync<Options>>(fp(pluginAsyncWithOptions))

// Fastify register

const server = fastify()
server.register(fp(pluginCallback))
server.register(fp(pluginCallbackWithTypes))
server.register(fp(pluginCallbackWithOptions))
server.register(fp(pluginAsync))
server.register(fp(pluginAsyncWithTypes))
server.register(fp(pluginAsyncWithOptions))
