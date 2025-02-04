/// <reference types="fastify" />

import {
  FastifyPluginCallback,
  FastifyPluginAsync,
  FastifyPluginOptions,
  RawServerBase,
  RawServerDefault,
  FastifyTypeProvider,
  FastifyTypeProviderDefault,
  FastifyBaseLogger,
  FastifyInstance,
} from 'fastify'

type FastifyPlugin = typeof fastifyPlugin

declare namespace fastifyPlugin {
  export interface PluginMetadata {
    /** Bare-minimum version of Fastify for your plugin, just add the semver range that you need. */
    fastify?: string,
    name?: string,
    /** Decorator dependencies for this plugin */
    decorators?: {
      fastify?: (string | symbol)[],
      reply?: (string | symbol)[],
      request?: (string | symbol)[]
    },
    /** The plugin dependencies */
    dependencies?: string[],
    encapsulate?: boolean
  }
  // Exporting PluginOptions for backward compatibility after renaming it to PluginMetadata
  /**
   * @deprecated Use PluginMetadata instead
   */
  export interface PluginOptions extends PluginMetadata {}

  export const fastifyPlugin: FastifyPlugin
  export { fastifyPlugin as default }
}

// Todo: import decorators from fastify
interface FastifyDecorators { fastify?: object, request?: object, reply?: object }
interface FastifyPluginDecorators {
  decorators: FastifyDecorators,
  dependencies: (FastifyPluginCallback<any, any, any, any, any> | FastifyPluginAsync<any, any, any, any, any>)[],
}

type GetSixthGenericOfFasityInstance<T> = T extends FastifyInstance<any, any, any, any, any, infer U> ? U : void
type GetFirstParameter<T> = T extends (...args: infer P) => any ? P[0] : void

/**
 * This function does three things for you:
 *   1. Add the `skip-override` hidden property
 *   2. Check bare-minimum version of Fastify
 *   3. Pass some custom metadata of the plugin to Fastify
 * @param fn Fastify plugin function
 * @param options Optional plugin options
 */

declare function fastifyPlugin<
  Decorators extends FastifyPluginDecorators = { decorators: {}, dependencies: [] },
  Options extends FastifyPluginOptions = Record<never, never>,
  RawServer extends RawServerBase = RawServerDefault,
  TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
  Fn extends FastifyPluginCallback<Options, RawServer, TypeProvider, Logger, Decorators['decorators']> | FastifyPluginAsync<Options, RawServer, TypeProvider, Logger, Decorators['decorators']> = FastifyPluginCallback<Options, RawServer, TypeProvider, Logger, Decorators['decorators']>
> (
  fn: Fn extends unknown ? Fn extends (...args: any) => Promise<any> ? FastifyPluginAsync<Options, RawServer, TypeProvider, Logger, Decorators['decorators'] & GetSixthGenericOfFasityInstance<GetFirstParameter<Decorators['dependencies'][number] extends undefined ? {} : Decorators['dependencies'][number]>>> : FastifyPluginCallback<Options, RawServer, TypeProvider, Logger, Decorators['decorators'] & GetSixthGenericOfFasityInstance<GetFirstParameter<Decorators['dependencies'][number] extends undefined ? {} : Decorators['dependencies'][number]>>> : Fn,
  options?: fastifyPlugin.PluginMetadata | string
): Fn

export default fastifyPlugin
export type GetPluginTypes<Decorators extends FastifyPluginDecorators = { decorators: {}, dependencies: [] }, Options extends FastifyPluginOptions = {}> = FastifyPluginAsync<Options, RawServerDefault, FastifyTypeProviderDefault, FastifyBaseLogger, Decorators['decorators'] & GetSixthGenericOfFasityInstance<GetFirstParameter<Decorators['dependencies'][number] extends undefined ? (instance: any) => {} : Decorators['dependencies'][number]>>> | FastifyPluginCallback<Options, RawServerDefault, FastifyTypeProviderDefault, FastifyBaseLogger, Decorators['decorators'] & GetSixthGenericOfFasityInstance<GetFirstParameter<Decorators['dependencies'][number] extends undefined ? (instance: any) => {} : Decorators['dependencies'][number]>>>
