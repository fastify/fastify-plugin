import fastifyPlugin from '..';
import fastify, {
  FastifyPluginCallback,
  FastifyPluginAsync,
  FastifyError,
  FastifyInstance,
  FastifyPluginOptions,
  UnEncapsulatedPlugin,
} from 'fastify';
import { expectAssignable, expectError, expectNotType, expectType } from 'tsd'
import { Server } from "node:https"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import fastifyExampleCallback from './example-callback.test-d';
import fastifyExampleAsync from './example-async.test-d';

interface Options extends FastifyPluginOptions {
  foo?: string
}

const testSymbol = Symbol('foobar')

// Callback

const pluginCallback = fastifyPlugin((fastify, options, next) => fastify)
expectAssignable<UnEncapsulatedPlugin<FastifyPluginCallback>>(pluginCallback)

const pluginCallbackWithTypes = fastifyPlugin((fastify: FastifyInstance, options: FastifyPluginOptions, next) => fastify)
expectType<UnEncapsulatedPlugin<FastifyPluginCallback<FastifyPluginOptions, FastifyInstance, FastifyInstance>>>(pluginCallbackWithTypes)
expectNotType<any>(pluginCallbackWithTypes)

expectAssignable<FastifyPluginCallback>(fastifyPlugin((fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void) => fastify))
expectNotType<any>(fastifyPlugin((fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void) => fastify))

expectAssignable<UnEncapsulatedPlugin<FastifyPluginCallback>>(fastifyPlugin(pluginCallback, ''))
expectAssignable<UnEncapsulatedPlugin<FastifyPluginCallback>>(fastifyPlugin(pluginCallback, {
  fastify: '',
  name: '',
  decorators: {
    fastify: ['', testSymbol],
    reply: ['', testSymbol],
    request: ['', testSymbol]
  },
  dependencies: [''],
  encapsulate: true
}))

const pluginCallbackWithOptions = fastifyPlugin((fastify, options: Options, next) => {
  expectType<Options['foo']>(options.foo)
  return fastify
})
expectAssignable<UnEncapsulatedPlugin<FastifyPluginCallback<Options>>>(pluginCallbackWithOptions)

const pluginCallbackWithServer = fastifyPlugin((fastify: FastifyInstance<Server>, options, next) => {
  expectType<Server>(fastify.server)
  return fastify
})
expectAssignable<UnEncapsulatedPlugin<FastifyPluginCallback<FastifyPluginOptions, FastifyInstance<Server>, FastifyInstance<Server>>>>(pluginCallbackWithServer)

const pluginCallbackWithTypeProvider = fastifyPlugin((fastify: FastifyInstance, options: Options, next) => fastify.withTypeProvider<TypeBoxTypeProvider>())
expectAssignable<
  UnEncapsulatedPlugin<
    FastifyPluginCallback<
      Options,
      FastifyInstance,
      FastifyInstance<Server, any, any, any, TypeBoxTypeProvider, any>
    >
  >
>(pluginCallbackWithTypeProvider)

// Async

const pluginAsync = fastifyPlugin(async (fastify, options) => fastify)
expectAssignable<UnEncapsulatedPlugin<FastifyPluginAsync>>(pluginAsync)

const pluginAsyncWithTypes = fastifyPlugin(async (fastify: FastifyInstance, options: FastifyPluginOptions) => fastify)
expectType<UnEncapsulatedPlugin<FastifyPluginAsync<FastifyPluginOptions, FastifyInstance, FastifyInstance>>>(pluginAsyncWithTypes)

expectAssignable<UnEncapsulatedPlugin<FastifyPluginAsync>>(fastifyPlugin(pluginAsync, ''))
expectAssignable<UnEncapsulatedPlugin<FastifyPluginAsync>>(fastifyPlugin(pluginAsync, {
  fastify: '',
  name: '',
  decorators: {
    fastify: ['', testSymbol],
    reply: ['', testSymbol],
    request: ['', testSymbol]
  },
  dependencies: [''],
  encapsulate: true
}))

const pluginAsyncWithOptions = fastifyPlugin(async (fastify, options: Options) => {
  expectType<Options['foo']>(options.foo)
  return fastify
})
expectAssignable<UnEncapsulatedPlugin<FastifyPluginAsync<Options>>>(pluginAsyncWithOptions)

const pluginAsyncWithServer = fastifyPlugin(async (fastify: FastifyInstance<Server>, options) => {
  expectType<Server>(fastify.server)
  return fastify
})
expectAssignable<UnEncapsulatedPlugin<FastifyPluginAsync<FastifyPluginOptions, FastifyInstance<Server>, FastifyInstance<Server>>>>(pluginAsyncWithServer)

const pluginAsyncWithTypeProvider = fastifyPlugin(async (fastify: FastifyInstance, options: Options) => fastify.withTypeProvider<TypeBoxTypeProvider>())
expectAssignable<
  UnEncapsulatedPlugin<
    FastifyPluginAsync<
      Options,
      FastifyInstance,
      FastifyInstance<Server, any, any, any, TypeBoxTypeProvider, any>
    >
  >
>(pluginAsyncWithTypeProvider)

// Fastify register

const server = fastify()
server.register(pluginCallback)
server.register(pluginCallbackWithTypes)
server.register(pluginCallbackWithOptions)
// TODO
// server.register(pluginCallbackWithServer)
server.register(pluginCallbackWithTypeProvider)
server.register(pluginAsync)
server.register(pluginAsyncWithTypes)
server.register(pluginAsyncWithOptions)
// TODO
// server.register(pluginAsyncWithServer)
server.register(pluginAsyncWithTypeProvider)

// properly handling callback and async
fastifyPlugin(function (fastify, options, next) {
  expectAssignable<FastifyInstance>(fastify)
  expectType<Record<never, never>>(options)
  expectType<(err?: Error) => void>(next)
  return fastify
})

fastifyPlugin<Options>(function (fastify, options, next) {
  expectAssignable<FastifyInstance>(fastify)
  expectType<Options>(options)
  expectType<(err?: Error) => void>(next)
  return fastify
})

fastifyPlugin<Options>(async function (fastify, options) {
  expectAssignable<FastifyInstance>(fastify)
  expectType<Options>(options)
  return fastify
})

expectAssignable<FastifyPluginAsync<Options>>(fastifyPlugin(async function (fastify: FastifyInstance, options: Options) {
  return fastify
}))
expectNotType<any>(fastifyPlugin(async function (fastify: FastifyInstance, options: Options) {
  return fastify
}))

fastifyPlugin(async function (fastify, options: Options) {
  expectAssignable<FastifyInstance>(fastify)
  expectType<Options>(options)
  return fastify
})

fastifyPlugin(async function (fastify, options) {
  expectAssignable<FastifyInstance>(fastify)
  expectType<Record<never, never>>(options)
  return fastify
})

expectError(
  fastifyPlugin(async function (fastify, options: Options, next) {
    expectAssignable<FastifyInstance>(fastify)
    expectType<Options>(options)
    return fastify
  })
)
expectAssignable<FastifyPluginCallback<Options>>(fastifyPlugin(function (fastify, options, next) {
  return fastify
}))
expectNotType<any>(fastifyPlugin(function (fastify, options, next) {
  return fastify
}))

fastifyPlugin(function (fastify, options: Options, next) {
  expectAssignable<FastifyInstance>(fastify)
  expectType<Options>(options)
  expectType<(err?: Error) => void>(next)

  return fastify
})

expectError(
  fastifyPlugin(function (fastify, options: Options, next) {
    expectAssignable<FastifyInstance>(fastify)
    expectType<Options>(options)
    return Promise.resolve(fastify)
  })
)

server.register(fastifyExampleCallback, { foo: 'bar' } as const)
expectError(server.register(fastifyExampleCallback, { foo: 'baz' }))

server.register(fastifyExampleAsync, { foo: 'bar' } as const)
expectError(server.register(fastifyExampleAsync, { foo: 'baz' }))
