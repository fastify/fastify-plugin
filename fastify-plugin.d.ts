import fastify, { FastifyPlugin } from 'fastify';

/**
 * This function does three things for you:
 *   1. Add the `skip-override` hidden property
 *   2. Check bare-minimum version of Fastify
 *   3. Pass some custom metadata of the plugin to Fastify
 * @param fn Fastify plugin function
 * @param options Optional plugin options
 */
export default function fp (
  fn: FastifyPlugin,
  options?: string | FPOptions
): FastifyPlugin;

/** Options object for fastify-plugin. Not to be confused with fastify.FastifyPluginOptions */
export interface FPOptions {
  /** Bare-minimum version of Fastify for your plugin, just add the semver range that you need. */
  fastify?: string,
  name?: string,
  /** Decorator dependencies for this plugin */
  decorators?: {
    fastify?: string[],
    reply?: string[],
    request?: string[]
  },
  /** The plugin dependencies */
  dependencies?: string[]
}
