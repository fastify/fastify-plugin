import {
  ApplyDependencies,
  FastifyDependencies,
  FastifyPluginAsync,
  FastifyPluginCallback,
  UnEncapsulatedPlugin
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

  /**
   * Metadata accepted by `createPlugin()`.
   * `dependencies` are type-level plugin dependencies rather than runtime plugin names.
   */
  export interface CreatePluginMetadata<TDependencies extends FastifyDependencies> extends Omit<PluginMetadata, 'dependencies'> {
    dependencies?: TDependencies
  }

  // Exporting PluginOptions for backward compatibility after renaming it to PluginMetadata
  /**
   * @deprecated Use PluginMetadata instead
   */
  export interface PluginOptions extends PluginMetadata {}

  export const fastifyPlugin: FastifyPlugin
  export { fastifyPlugin as default }

  export function createPlugin <TPlugin extends (...args: any[]) => any> (
    plugin: TPlugin extends FastifyPluginCallback<any> ? TPlugin : never,
    options?: Omit<PluginMetadata, 'dependencies'>
  ): UnEncapsulatedPlugin<TPlugin>

  export function createPlugin <
    TPlugin extends (...args: any[]) => any,
    TDependencies extends FastifyDependencies,
    TEnhanced extends ApplyDependencies<Extract<TPlugin, FastifyPluginCallback<any>>, TDependencies> = ApplyDependencies<Extract<TPlugin, FastifyPluginCallback<any>>, TDependencies>
  > (
    plugin: TEnhanced,
    options: CreatePluginMetadata<TDependencies>
  ): UnEncapsulatedPlugin<TEnhanced>

  export function createPlugin <TPlugin extends (...args: any[]) => any> (
    plugin: TPlugin extends FastifyPluginAsync<any> ? TPlugin : never,
    options?: Omit<PluginMetadata, 'dependencies'>
  ): UnEncapsulatedPlugin<TPlugin>

  export function createPlugin <
    TPlugin extends (...args: any[]) => any,
    TDependencies extends FastifyDependencies,
    TEnhanced extends ApplyDependencies<Extract<TPlugin, FastifyPluginAsync<any>>, TDependencies> = ApplyDependencies<Extract<TPlugin, FastifyPluginAsync<any>>, TDependencies>
  > (
    plugin: TEnhanced,
    options: CreatePluginMetadata<TDependencies>
  ): UnEncapsulatedPlugin<TEnhanced>
}

/**
 * This function does three things for you:
 *   1. Add the `skip-override` hidden property
 *   2. Check bare-minimum version of Fastify
 *   3. Pass some custom metadata of the plugin to Fastify
 * @param fn Fastify plugin function
 * @param options Optional plugin options
 */

declare function fastifyPlugin <TPlugin extends (...args: any[]) => any> (
  fn: TPlugin extends FastifyPluginCallback<any> ? TPlugin : never,
  options?: fastifyPlugin.PluginMetadata | string
): UnEncapsulatedPlugin<NoInfer<TPlugin>>

declare function fastifyPlugin <TPlugin extends (...args: any[]) => any> (
  fn: TPlugin extends FastifyPluginAsync<any> ? TPlugin : never,
  options?: fastifyPlugin.PluginMetadata | string
): UnEncapsulatedPlugin<NoInfer<TPlugin>>

export = fastifyPlugin
