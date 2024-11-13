/// <reference types="fastify" />

import {
  FastifyPluginOptions,
  AnyFastifyInstance,
  UnEncapsulatedPlugin,
  FastifyPluginCallback,
  FastifyPluginAsync,
  ApplyDependencies,
  FastifyDependencies
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

  export function createPlugin<
    TPlugin extends FastifyPluginCallback,
    TDependencies extends FastifyDependencies,
    TEnhanced extends ApplyDependencies<TPlugin, TDependencies> = ApplyDependencies<TPlugin, TDependencies>
  > (plugin: TEnhanced, options?: { dependencies?: TDependencies }): UnEncapsulatedPlugin<TEnhanced>

  export function createPlugin<
    TPlugin extends FastifyPluginAsync,
    TDependencies extends FastifyDependencies,
    TEnhanced extends ApplyDependencies<TPlugin, TDependencies> = ApplyDependencies<TPlugin, TDependencies>
  > (plugin: TEnhanced, options?: { dependencies?: TDependencies }): UnEncapsulatedPlugin<TEnhanced>
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
  Options extends FastifyPluginOptions = Record<never, never>,
  Plugin extends FastifyPluginCallback<Options, AnyFastifyInstance, AnyFastifyInstance> = FastifyPluginCallback<Options, AnyFastifyInstance, AnyFastifyInstance>>(
  fn: Plugin,
  options?: fastifyPlugin.PluginMetadata | string
): UnEncapsulatedPlugin<NoInfer<Plugin>>;

declare function fastifyPlugin<
  Options extends FastifyPluginOptions = Record<never, never>,
  Plugin extends FastifyPluginAsync<Options, AnyFastifyInstance, AnyFastifyInstance> = FastifyPluginAsync<Options, AnyFastifyInstance, AnyFastifyInstance>>(
  fn: Plugin,
  options?: fastifyPlugin.PluginMetadata | string
): UnEncapsulatedPlugin<NoInfer<Plugin>>;

export = fastifyPlugin
