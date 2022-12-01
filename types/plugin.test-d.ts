import fastifyPlugin from '..';
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
expectAssignable<FastifyPluginCallback>(fastifyPlugin(pluginCallback))

const pluginCallbackWithTypes = (fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void): void => { }
expectAssignable<FastifyPluginCallback>(fastifyPlugin(pluginCallbackWithTypes))

expectAssignable<FastifyPluginCallback>(fastifyPlugin((fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void): void => { }))

expectAssignable<FastifyPluginCallback>(fastifyPlugin(pluginCallback, '' ))
expectAssignable<FastifyPluginCallback>(fastifyPlugin(pluginCallback, {
  fastify: '',
  name: '',
  decorators: {
    fastify: [ '', testSymbol ],
    reply: [ '', testSymbol ],
    request: [ '', testSymbol ]
  },
  dependencies: [ '' ],
  encapsulate: true
}))

const pluginCallbackWithOptions: FastifyPluginCallback<Options> = (fastify, options, next) => {
  expectAssignable<string>(options.foo)
}

expectAssignable<FastifyPluginCallback<Options>>(fastifyPlugin(pluginCallbackWithOptions))

const pluginCallbackWithServer: FastifyPluginCallback<Options, Server> = (fastify, options, next) => {
  expectAssignable<Server>(fastify.server)
}

expectAssignable<FastifyPluginCallback<Options, Server>>(fastifyPlugin(pluginCallbackWithServer))

const pluginCallbackWithTypeProvider: FastifyPluginCallback<Options, Server, TypeBoxTypeProvider> = (fastify, options, next) => {}

expectAssignable<FastifyPluginCallback<Options, Server, TypeBoxTypeProvider>>(fastifyPlugin(pluginCallbackWithTypeProvider))

// Async

const pluginAsync: FastifyPluginAsync = async (fastify, options) => { }
expectAssignable<FastifyPluginAsync>(fastifyPlugin(pluginAsync))

const pluginAsyncWithTypes = async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => { }
expectAssignable<FastifyPluginAsync>(fastifyPlugin(pluginAsyncWithTypes))

expectAssignable<FastifyPluginAsync>(fastifyPlugin(async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => { }))
expectAssignable<FastifyPluginAsync>(fastifyPlugin(pluginAsync, '' ))
expectAssignable<FastifyPluginAsync>(fastifyPlugin(pluginAsync, {
  fastify: '',
  name: '',
  decorators: {
    fastify: [ '', testSymbol ],
    reply: [ '', testSymbol ],
    request: [ '', testSymbol ]
  },
  dependencies: [ '' ],
  encapsulate: true
}))

const pluginAsyncWithOptions: FastifyPluginAsync<Options> = async (fastify, options) => {
  expectAssignable<string>(options.foo)
}

expectAssignable<FastifyPluginAsync<Options>>(fastifyPlugin(pluginAsyncWithOptions))

const pluginAsyncWithServer: FastifyPluginAsync<Options, Server> = async (fastify, options) => {
  expectAssignable<Server>(fastify.server)
}

expectAssignable<FastifyPluginAsync<Options, Server>>(fastifyPlugin(pluginAsyncWithServer))

const pluginAsyncWithTypeProvider: FastifyPluginAsync<Options, Server, TypeBoxTypeProvider> = async (fastify, options) => {}

expectAssignable<FastifyPluginAsync<Options, Server, TypeBoxTypeProvider>>(fastifyPlugin(pluginAsyncWithTypeProvider))

// Fastify register

const server = fastify()
server.register(fastifyPlugin(pluginCallback))
server.register(fastifyPlugin(pluginCallbackWithTypes))
server.register(fastifyPlugin(pluginCallbackWithOptions))
server.register(fastifyPlugin(pluginCallbackWithServer))
server.register(fastifyPlugin(pluginCallbackWithTypeProvider))
server.register(fastifyPlugin(pluginAsync))
server.register(fastifyPlugin(pluginAsyncWithTypes))
server.register(fastifyPlugin(pluginAsyncWithOptions))
server.register(fastifyPlugin(pluginAsyncWithServer))
server.register(fastifyPlugin(pluginAsyncWithTypeProvider))
