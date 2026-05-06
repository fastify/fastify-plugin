import { expect } from 'tstyche'
import fastifyPlugin from './plugin'
import fastify, {
  FastifyPluginCallback,
  FastifyPluginAsync,
  FastifyError,
  FastifyInstance,
  FastifyPluginOptions,
  RawServerDefault,
  FastifyTypeProviderDefault,
  FastifyBaseLogger
} from 'fastify'
import { Server } from 'node:https'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import fastifyExampleCallback from './example-callback.tst'
import fastifyExampleAsync from './example-async.tst'

interface Options {
  foo: string;
}

const testSymbol = Symbol('foobar')

const pluginCallback: FastifyPluginCallback = (_fastify, _options, _next) => {}
expect(fastifyPlugin(pluginCallback)).type.toBe<FastifyPluginCallback>()

const pluginCallbackWithTypes = (
  _fastify: FastifyInstance,
  _options: FastifyPluginOptions,
  _next: (error?: FastifyError) => void
): void => {}
expect(
  fastifyPlugin(pluginCallbackWithTypes)
).type.toBeAssignableTo<FastifyPluginCallback>()
expect(fastifyPlugin(pluginCallbackWithTypes)).type.not.toBe<any>()

expect(
  fastifyPlugin(
    (
      _fastify: FastifyInstance,
      _options: FastifyPluginOptions,
      _next: (error?: FastifyError) => void
    ): void => {}
  )
).type.toBeAssignableTo<FastifyPluginCallback>()

expect(fastifyPlugin(pluginCallback, '')).type.toBe<FastifyPluginCallback>()
expect(
  fastifyPlugin(pluginCallback, {
    fastify: '',
    name: '',
    decorators: {
      fastify: ['', testSymbol],
      reply: ['', testSymbol],
      request: ['', testSymbol]
    },
    dependencies: [''],
    encapsulate: true
  })
).type.toBe<FastifyPluginCallback>()

const pluginCallbackWithOptions: FastifyPluginCallback<Options> = (
  _fastify,
  options,
  _next
) => {
  expect(options.foo).type.toBe<string>()
}
expect(fastifyPlugin(pluginCallbackWithOptions)).type.toBe<
  FastifyPluginCallback<Options>
>()

const pluginCallbackWithServer: FastifyPluginCallback<Options, Server> = (
  fastify,
  _options,
  _next
) => {
  expect(fastify.server).type.toBe<Server>()
}
expect(fastifyPlugin(pluginCallbackWithServer)).type.toBe<
  FastifyPluginCallback<Options, Server>
>()

const pluginCallbackWithTypeProvider: FastifyPluginCallback<
  Options,
  Server,
  TypeBoxTypeProvider
> = (_fastify, _options, _next) => {}
expect(fastifyPlugin(pluginCallbackWithTypeProvider)).type.toBe<
  FastifyPluginCallback<Options, Server, TypeBoxTypeProvider>
>();

(async () => {
  const pluginAsync: FastifyPluginAsync = async (_fastify, _options) => {}
  expect(fastifyPlugin(pluginAsync)).type.toBe<FastifyPluginAsync>()

  const pluginAsyncWithTypes = async (
    _fastify: FastifyInstance,
    _options: FastifyPluginOptions
  ): Promise<void> => {}
  expect(fastifyPlugin(pluginAsyncWithTypes)).type.toBe<
    FastifyPluginAsync<
      FastifyPluginOptions,
      RawServerDefault,
      FastifyTypeProviderDefault
    >
  >()

  expect(
    fastifyPlugin(
      async (
        _fastify: FastifyInstance,
        _options: FastifyPluginOptions
      ): Promise<void> => {}
    )
  ).type.toBe<
    FastifyPluginAsync<
      FastifyPluginOptions,
      RawServerDefault,
      FastifyTypeProviderDefault
    >
  >()

  expect(fastifyPlugin(pluginAsync, '')).type.toBe<FastifyPluginAsync>()
  expect(
    fastifyPlugin(pluginAsync, {
      fastify: '',
      name: '',
      decorators: {
        fastify: ['', testSymbol],
        reply: ['', testSymbol],
        request: ['', testSymbol]
      },
      dependencies: [''],
      encapsulate: true
    })
  ).type.toBe<FastifyPluginAsync>()

  const pluginAsyncWithOptions: FastifyPluginAsync<Options> = async (
    _fastify,
    options
  ) => {
    expect(options.foo).type.toBe<string>()
  }
  expect(fastifyPlugin(pluginAsyncWithOptions)).type.toBe<
    FastifyPluginAsync<Options>
  >()

  const pluginAsyncWithServer: FastifyPluginAsync<Options, Server> = async (
    fastify,
    _options
  ) => {
    expect(fastify.server).type.toBe<Server>()
  }
  expect(fastifyPlugin(pluginAsyncWithServer)).type.toBe<
    FastifyPluginAsync<Options, Server>
  >()

  const pluginAsyncWithTypeProvider: FastifyPluginAsync<
    Options,
    Server,
    TypeBoxTypeProvider
  > = async (_fastify, _options) => {}
  expect(fastifyPlugin(pluginAsyncWithTypeProvider)).type.toBe<
    FastifyPluginAsync<Options, Server, TypeBoxTypeProvider>
  >()

  const server = fastify()
  server.register(fastifyPlugin(pluginCallback))
  server.register(fastifyPlugin(pluginCallbackWithTypes), { foo: 'bar' })
  server.register(fastifyPlugin(pluginCallbackWithOptions), { foo: 'bar' })
  server.register(fastifyPlugin(pluginCallbackWithServer), { foo: 'bar' })
  server.register(fastifyPlugin(pluginCallbackWithTypeProvider), {
    foo: 'bar'
  })
  server.register(fastifyPlugin(pluginAsync))
  server.register(fastifyPlugin(pluginAsyncWithTypes), { foo: 'bar' })
  server.register(fastifyPlugin(pluginAsyncWithOptions), { foo: 'bar' })
  server.register(fastifyPlugin(pluginAsyncWithServer), { foo: 'bar' })
  server.register(fastifyPlugin(pluginAsyncWithTypeProvider), { foo: 'bar' })

  // Handling Callback and Async Inline
  fastifyPlugin(function (fastify, options, next) {
    expect(fastify).type.toBe<FastifyInstance>()
    expect(options).type.toBe<Record<never, never>>()
    expect(next).type.toBe<(err?: Error) => void>()
  })

  fastifyPlugin<Options>(function (fastify, options, next) {
    expect(fastify).type.toBe<FastifyInstance>()
    expect(options).type.toBe<Options>()
    expect(next).type.toBe<(err?: Error) => void>()
  })

  fastifyPlugin<Options>(async function (fastify, options) {
    expect(fastify).type.toBe<FastifyInstance>()
    expect(options).type.toBe<Options>()
  })

  expect(
    fastifyPlugin(async function (
      _fastify: FastifyInstance,
      _options: Options
    ) {})
  ).type.toBeAssignableTo<
    FastifyPluginAsync<
      Options,
      RawServerDefault,
      FastifyTypeProviderDefault,
      FastifyBaseLogger
    >
  >()

  expect(
    fastifyPlugin(async function (
      _fastify: FastifyInstance,
      _options: Options
    ) {})
  ).type.not.toBe<any>()

  fastifyPlugin(async function (fastify, options: Options) {
    expect(fastify).type.toBe<FastifyInstance>()
    expect(options).type.toBe<Options>()
  })

  fastifyPlugin(async function (fastify, options) {
    expect(fastify).type.toBe<FastifyInstance>()
    expect(options).type.toBe<Record<never, never>>()
  })

  expect(async function (
    fastify: FastifyInstance,
    options: Options,
    _next: any
  ) {}).type.not.toBeAssignableTo<Parameters<typeof fastifyPlugin>[0]>()

  expect(
    fastifyPlugin(function (_fastify, _options, _next) {})
  ).type.toBeAssignableTo<FastifyPluginCallback<Options>>()

  fastifyPlugin(function (fastify, options: Options, next) {
    expect(fastify).type.toBe<FastifyInstance>()
    expect(options).type.toBe<Options>()
    expect(next).type.toBe<(err?: Error) => void>()
  })

  expect(function (fastify: FastifyInstance, options: Options, _next: any) {
    return Promise.resolve()
  }).type.not.toBeAssignableTo<Parameters<typeof fastifyPlugin>[0]>()

  server.register(fastifyExampleCallback, { foo: 'bar' })
  expect({ foo: 'baz' as any }).type.not.toBe<{ foo: string }>()

  server.register(fastifyExampleAsync, { foo: 'bar' })
  expect({ foo: 'baz' as any }).type.not.toBe<{ foo: string }>()
})()
