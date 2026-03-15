import fastifyPlugin, { createPlugin } from '..'
import fastify, {
  AnyFastifyInstance,
  FastifyError,
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
  UnEncapsulatedPlugin
} from 'fastify'
import { expectAssignable, expectError, expectNotType, expectType } from 'tsd'
import { Server } from 'node:https'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import fastifyExampleCallback from './example-callback.test-d'
import fastifyExampleAsync from './example-async.test-d'

interface Options extends FastifyPluginOptions {
  foo: string
}

const testSymbol = Symbol('foobar')

const legacyCallback: FastifyPluginCallback<Options> = (_fastify, options, done) => {
  expectType<string>(options.foo)
  done()
}
expectAssignable<UnEncapsulatedPlugin<FastifyPluginCallback<Options>>>(
  fastifyPlugin(legacyCallback)
)
expectNotType<any>(fastifyPlugin(legacyCallback))

const legacyAsync: FastifyPluginAsync<Options> = async (_fastify, options) => {
  expectType<string>(options.foo)
}
expectAssignable<UnEncapsulatedPlugin<FastifyPluginAsync<Options>>>(
  fastifyPlugin(legacyAsync)
)
expectNotType<any>(fastifyPlugin(legacyAsync))

const wrappedCallback = fastifyPlugin((fastify: FastifyInstance, _options: FastifyPluginOptions, _next: (error?: FastifyError) => void) => {
  return fastify.decorate('wrappedCallback', true)
}, {
  fastify: '',
  name: 'wrapped-callback',
  decorators: {
    fastify: ['', testSymbol],
    reply: ['', testSymbol],
    request: ['', testSymbol]
  },
  dependencies: [''],
  encapsulate: true
})
expectAssignable<UnEncapsulatedPlugin<FastifyPluginCallback>>(wrappedCallback)

const wrappedAsync = fastifyPlugin(async (fastify: FastifyInstance) => {
  return fastify.decorate('wrappedAsync', true)
})
expectAssignable<UnEncapsulatedPlugin<FastifyPluginAsync>>(wrappedAsync)

const callbackWithServer = fastifyPlugin((fastify: FastifyInstance<Server>) => {
  expectType<Server>(fastify.server)
  return fastify
})
expectAssignable<
  UnEncapsulatedPlugin<FastifyPluginCallback<FastifyPluginOptions, FastifyInstance<Server>, FastifyInstance<Server>>>
>(callbackWithServer)

const asyncWithTypeProvider = fastifyPlugin(async (fastify: FastifyInstance, options: Options) => {
  expectType<string>(options.foo)
  return fastify.withTypeProvider<TypeBoxTypeProvider>()
})
expectAssignable<UnEncapsulatedPlugin<FastifyPluginAsync<Options>>>(asyncWithTypeProvider)

const createdPlugin = createPlugin((instance: FastifyInstance) => {
  return instance.decorate('createdPlugin', 42)
})
expectNotType<any>(createdPlugin)

const app = fastify()
app.register(fastifyPlugin(legacyCallback), { foo: 'bar' })
app.register(fastifyPlugin(legacyAsync), { foo: 'bar' })
app.register(wrappedCallback)
app.register(wrappedAsync)
app.register(createdPlugin)

fastifyPlugin(function (fastify, options: Options, next: (err?: Error) => void) {
  expectAssignable<AnyFastifyInstance>(fastify)
  expectType<Options>(options)
  expectType<(err?: Error) => void>(next)
  return fastify
})

fastifyPlugin(async function (fastify, options: Options) {
  expectAssignable<AnyFastifyInstance>(fastify)
  expectType<Options>(options)
  return fastify
})

expectError(
  fastifyPlugin(async function (fastify, options: Options, _next) {
    expectAssignable<AnyFastifyInstance>(fastify)
    expectType<Options>(options)
    return fastify
  })
)

expectError(
  fastifyPlugin(function (fastify, options: Options, _next) {
    expectAssignable<AnyFastifyInstance>(fastify)
    expectType<Options>(options)
    return Promise.resolve(fastify)
  })
)

const pluginCallbackWithTypes = (fastify: FastifyInstance, _options: FastifyPluginOptions, _next: (error?: FastifyError) => void): FastifyInstance => fastify
expectAssignable<UnEncapsulatedPlugin<FastifyPluginCallback>>(fastifyPlugin(pluginCallbackWithTypes))

const pluginAsyncWithTypes = async (fastify: FastifyInstance, _options: FastifyPluginOptions): Promise<FastifyInstance> => fastify
expectAssignable<UnEncapsulatedPlugin<FastifyPluginAsync>>(fastifyPlugin(pluginAsyncWithTypes))

const exampleApp = fastify()
exampleApp.register(fastifyExampleCallback, { foo: 'bar' } as const)
expectError(exampleApp.register(fastifyExampleCallback, { foo: 'baz' } as const))

exampleApp.register(fastifyExampleAsync, { foo: 'bar' } as const)
expectError(exampleApp.register(fastifyExampleAsync, { foo: 'baz' } as const))
