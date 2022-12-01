/// <reference types="fastify" />

import {
  FastifyPluginCallback,
  FastifyPluginAsync,
  FastifyPluginOptions,
  RawServerBase,
  RawServerDefault,
  FastifyTypeProvider,
  FastifyTypeProviderDefault,
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

/**
 * This function does three things for you:
 *   1. Add the `skip-override` hidden property
 *   2. Check bare-minimum version of Fastify
 *   3. Pass some custom metadata of the plugin to Fastify
 * @param fn Fastify plugin function
 * @param options Optional plugin options
 */
 declare function fastifyPlugin<
 Options extends FastifyPluginOptions,
 RawServer extends RawServerBase = RawServerDefault,
 TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault
>(
 fn: FastifyPluginAsync<Options, RawServer, TypeProvider>,
 options?: fastifyPlugin.PluginMetadata
): FastifyPluginAsync<Options, RawServer, TypeProvider>;

declare function fastifyPlugin<
 Options extends FastifyPluginOptions,
 RawServer extends RawServerBase = RawServerDefault,
 TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault
>(
 fn: FastifyPluginAsync<Options, RawServer, TypeProvider>,
 options?: string
): FastifyPluginAsync<Options, RawServer, TypeProvider>;

declare function fastifyPlugin<
 Options extends FastifyPluginOptions,
 RawServer extends RawServerBase = RawServerDefault,
 TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault
>(
 fn: FastifyPluginCallback<Options, RawServer, TypeProvider>,
 options?: fastifyPlugin.PluginMetadata
): FastifyPluginCallback<Options, RawServer, TypeProvider>;

declare function fastifyPlugin<
 Options extends FastifyPluginOptions,
 RawServer extends RawServerBase = RawServerDefault,
 TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault
>(
 fn: FastifyPluginCallback<Options>,
 options?: string
): FastifyPluginCallback<Options>;

export = fastifyPlugin
