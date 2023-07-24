import {FastifyBaseLogger} from "fastify"
import {FastifyPluginCallback} from "fastify"
import {FastifyPluginAsync} from "fastify"
import {FastifyTypeProvider} from "fastify"
import {RawServerBase} from "fastify"
import {FastifyPluginOptions} from "fastify"

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

/**
 * @deprecated Use PluginMetadata instead
 */
export interface PluginOptions extends PluginMetadata {}

export type PromiseFunction = (...args: any) => Promise<any>

export type PluginAsyncOrCallback<
  Options extends FastifyPluginOptions,
  RawServer extends RawServerBase,
  TypeProvider extends FastifyTypeProvider,
  Logger extends FastifyBaseLogger,
  Fn extends PluginAsyncOrCallback<Options, RawServer, TypeProvider, Logger, Fn> | unknown
> = FastifyPluginCallback<Options, RawServer, TypeProvider, Logger> |
FastifyPluginAsync<Options, RawServer, TypeProvider, Logger>

export type GetPluginAsyncOrCallback<
  Options extends FastifyPluginOptions,
  RawServer extends RawServerBase,
  TypeProvider extends FastifyTypeProvider,
  Logger extends FastifyBaseLogger,
  Fn extends PluginAsyncOrCallback<Options, RawServer, TypeProvider, Logger, Fn> | unknown,
> = Fn extends unknown
  ? Fn extends PromiseFunction
    ? FastifyPluginAsync<Options, RawServer, TypeProvider, Logger>
    : FastifyPluginCallback<Options, RawServer, TypeProvider, Logger>
  : Fn

