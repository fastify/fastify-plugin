import fp from './plugin';
import fastify, { FastifyPluginCallback, FastifyPluginAsync, FastifyError, FastifyInstance, FastifyPluginOptions } from 'fastify';
import { expectAssignable } from 'tsd'
import { Server } from "node:https"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"

interface Options {
  foo: string
}

const testSymbol = Symbol('foobar')

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
    fastify: [ '', testSymbol ],
    reply: [ '', testSymbol ],
    request: [ '', testSymbol ]
  },
  dependencies: [ '' ]
}))

const pluginCallbackWithOptions: FastifyPluginCallback<Options> = (fastify, options, next) => {
  expectAssignable<string>(options.foo)
}

expectAssignable<FastifyPluginCallback<Options>>(fp(pluginCallbackWithOptions))

const pluginCallbackWithServer: FastifyPluginCallback<Options, Server> = (fastify, options, next) => {
  expectAssignable<Server>(fastify.server)
}

expectAssignable<FastifyPluginCallback<Options, Server>>(fp(pluginCallbackWithServer))

const pluginCallbackWithTypeProvider: FastifyPluginCallback<Options, Server, TypeBoxTypeProvider> = (fastify, options, next) => {}

expectAssignable<FastifyPluginCallback<Options, Server, TypeBoxTypeProvider>>(fp(pluginCallbackWithTypeProvider))

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
    fastify: [ '', testSymbol ],
    reply: [ '', testSymbol ],
    request: [ '', testSymbol ]
  },
  dependencies: [ '' ]
}))

const pluginAsyncWithOptions: FastifyPluginAsync<Options> = async (fastify, options) => {
  expectAssignable<string>(options.foo)
}

expectAssignable<FastifyPluginAsync<Options>>(fp(pluginAsyncWithOptions))

const pluginAsyncWithServer: FastifyPluginAsync<Options, Server> = async (fastify, options) => {
  expectAssignable<Server>(fastify.server)
}

expectAssignable<FastifyPluginAsync<Options, Server>>(fp(pluginAsyncWithServer))

const pluginAsyncWithTypeProvider: FastifyPluginAsync<Options, Server, TypeBoxTypeProvider> = async (fastify, options) => {}

expectAssignable<FastifyPluginAsync<Options, Server, TypeBoxTypeProvider>>(fp(pluginAsyncWithTypeProvider))

// Fastify register

const server = fastify()
server.register(fp(pluginCallback))
server.register(fp(pluginCallbackWithTypes))
server.register(fp(pluginCallbackWithOptions))
server.register(fp(pluginCallbackWithServer))
server.register(fp(pluginCallbackWithTypeProvider))
server.register(fp(pluginAsync))
server.register(fp(pluginAsyncWithTypes))
server.register(fp(pluginAsyncWithOptions))
server.register(fp(pluginAsyncWithServer))
server.register(fp(pluginAsyncWithTypeProvider))
