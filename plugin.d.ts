/// <reference types="fastify" />

import {
  FastifyPlugin,
  FastifyPluginOptions,
  RawServerBase,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression
} from 'fastify'

/**
 * This function does three things for you:
 *   1. Add the `skip-override` hidden property
 *   2. Check bare-minimum version of Fastify
 *   3. Pass some custom metadata of the plugin to Fastify
 * @param fn Fastify plugin function
 * @param options Optional plugin options
 */
export default function fp<Options>(
  fn: FastifyPlugin<Options>,
  options?: string,
): FastifyPlugin<Options>;
export default function fp<Options>(
  fn: FastifyPlugin<Options>,
  options?: Options & PluginOptions,
): FastifyPlugin<Options>;

export interface PluginOptions {
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

export type NextCallback = (err?: Error) => void;
