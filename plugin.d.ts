/// <reference types="fastify" />

import {
  FastifyPluginCallback,
  FastifyPluginAsync,
} from 'fastify'

/**
 * This function does three things for you:
 *   1. Add the `skip-override` hidden property
 *   2. Check bare-minimum version of Fastify
 *   3. Pass some custom metadata of the plugin to Fastify
 * @param fn Fastify plugin function
 * @param options Optional plugin options
 */
export default function fp<Options>(fn: FastifyPluginAsync<Options>, options?: PluginMetadata): FastifyPluginAsync<Options>;
export default function fp<Options>(fn: FastifyPluginAsync<Options>, options?: string): FastifyPluginAsync<Options>;
export default function fp<Options>(fn: FastifyPluginCallback<Options>, options?: PluginMetadata): FastifyPluginCallback<Options>;
export default function fp<Options>(fn: FastifyPluginCallback<Options>, options?: string): FastifyPluginCallback<Options>;

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
  dependencies?: string[]
}

// Exporting PluginOptions for backward compatibility after renaming it to PluginMetadata
export interface PluginOptions extends PluginMetadata {}
