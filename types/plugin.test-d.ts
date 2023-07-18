import fastifyPlugin from '..';
import fastify, { FastifyPluginCallback, FastifyPluginAsync, FastifyError, FastifyInstance, FastifyPluginOptions, RawServerDefault, FastifyTypeProviderDefault } from 'fastify';
import { expectType } from 'tsd'
import { Server } from "node:https"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"

interface Options {
  foo: string
}

const testSymbol = Symbol('foobar')

// Callback

const pluginCallback: FastifyPluginCallback = (fastify, options, next) => { }
expectType<FastifyPluginCallback>(fastifyPlugin(pluginCallback))

const pluginCallbackWithTypes = (fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void): void => { }
expectType<FastifyPluginCallback<FastifyPluginOptions, RawServerDefault, FastifyTypeProviderDefault>>(fastifyPlugin(pluginCallbackWithTypes))

expectType<FastifyPluginCallback<FastifyPluginOptions, RawServerDefault, FastifyTypeProviderDefault>>(fastifyPlugin((fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void): void => { }))

expectType<FastifyPluginCallback>(fastifyPlugin(pluginCallback, '' ))
expectType<FastifyPluginCallback>(fastifyPlugin(pluginCallback, {
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
  expectType<string>(options.foo)
}

expectType<FastifyPluginCallback<Options>>(fastifyPlugin(pluginCallbackWithOptions))

const pluginCallbackWithServer: FastifyPluginCallback<Options, Server> = (fastify, options, next) => {
  expectType<Server>(fastify.server)
}

expectType<FastifyPluginCallback<Options, Server>>(fastifyPlugin(pluginCallbackWithServer))

const pluginCallbackWithTypeProvider: FastifyPluginCallback<Options, Server, TypeBoxTypeProvider> = (fastify, options, next) => {}

expectType<FastifyPluginCallback<Options, Server, TypeBoxTypeProvider>>(fastifyPlugin(pluginCallbackWithTypeProvider))

// Async

const pluginAsync: FastifyPluginAsync = async (fastify, options) => { }
expectType<FastifyPluginAsync>(fastifyPlugin(pluginAsync))

const pluginAsyncWithTypes = async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => { }
expectType<FastifyPluginAsync<FastifyPluginOptions, RawServerDefault, FastifyTypeProviderDefault>>(fastifyPlugin(pluginAsyncWithTypes))

expectType<FastifyPluginAsync<FastifyPluginOptions, RawServerDefault, FastifyTypeProviderDefault>>(fastifyPlugin(async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => { }))
expectType<FastifyPluginAsync>(fastifyPlugin(pluginAsync, '' ))
expectType<FastifyPluginAsync>(fastifyPlugin(pluginAsync, {
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
  expectType<string>(options.foo)
}

expectType<FastifyPluginAsync<Options>>(fastifyPlugin(pluginAsyncWithOptions))

const pluginAsyncWithServer: FastifyPluginAsync<Options, Server> = async (fastify, options) => {
  expectType<Server>(fastify.server)
}

expectType<FastifyPluginAsync<Options, Server>>(fastifyPlugin(pluginAsyncWithServer))

const pluginAsyncWithTypeProvider: FastifyPluginAsync<Options, Server, TypeBoxTypeProvider> = async (fastify, options) => {}

expectType<FastifyPluginAsync<Options, Server, TypeBoxTypeProvider>>(fastifyPlugin(pluginAsyncWithTypeProvider))

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

// properly handling callback and async
fastifyPlugin(function (fastify, options, next) {
  expectType<FastifyInstance>(fastify)
  expectType<Record<never, never>>(options)
  expectType<(err?: Error) => void>(next)
})

fastifyPlugin<Options>(function (fastify, options, next) {
  expectType<FastifyInstance>(fastify)
  expectType<Options>(options)
  expectType<(err?: Error) => void>(next)
})

fastifyPlugin<Options>(async function (fastify, options) {
  expectType<FastifyInstance>(fastify)
  expectType<Options>(options)
})