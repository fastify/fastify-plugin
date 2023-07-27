import {
  FastifyPluginOptions,
  RawServerBase,
  RawServerDefault,
  FastifyTypeProvider,
  FastifyTypeProviderDefault,
  FastifyBaseLogger
} from 'fastify'

import getPluginName from './lib/getPluginName'
import {
  GetPluginAsyncOrCallback,
  PluginAsyncOrCallback,
  PluginMetadata
} from './types'

import toCamelCase from './lib/toCamelCase'

let count = 0

/**
 * This function does three things for you:
 *   1. Add the `skip-override` hidden property
 *   2. Check bare-minimum version of Fastify
 *   3. Pass some custom metadata of the plugin to Fastify
 * @param fn Fastify plugin function
 * @param options Optional plugin options
 */
export default function plugin<
  Options extends FastifyPluginOptions = Record<never, never>,
  RawServer extends RawServerBase = RawServerDefault,
  TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
  Fn extends PluginAsyncOrCallback<Options, RawServer, TypeProvider, Logger, Fn> =
  GetPluginAsyncOrCallback<Options, RawServer, TypeProvider, Logger, unknown>,
> (
  fn: GetPluginAsyncOrCallback<Options, RawServer, TypeProvider, Logger, Fn> | { default: GetPluginAsyncOrCallback<Options, RawServer, TypeProvider, Logger, Fn> },
  options: PluginMetadata | string = {}
): GetPluginAsyncOrCallback<Options, RawServer, TypeProvider, Logger, Fn> &
  { default: GetPluginAsyncOrCallback<Options, RawServer, TypeProvider, Logger, Fn> } &
  { [K in undefined extends Options['name'] ? string : Options['name']]?: GetPluginAsyncOrCallback<Options, RawServer, TypeProvider, Logger, Fn> } {
  let autoName = false

  if ('default' in fn) {
    // Support for 'export default' behaviour in transpiled ECMAScript module
    fn = fn.default
  }

  if (typeof fn !== 'function') {
    throw new TypeError(
      `fastify-plugin expects a function, instead got a '${typeof fn}'`
    )
  }

  if (typeof options === 'string') {
    options = {
      fastify: options
    }
  }

  if (
    typeof options !== 'object' ||
    Array.isArray(options) ||
    options === null
  ) {
    throw new TypeError('The options object should be an object')
  }

  if (options.fastify !== undefined && typeof options.fastify !== 'string') {
    throw new TypeError(`fastify-plugin expects a version string, instead got '${typeof options.fastify}'`)
  }

  if (options.name === undefined) {
    autoName = true
    options.name = getPluginName(fn) + '-auto-' + String(count++)
  }

  Reflect.set(fn, Symbol.for('skip-override'), options.encapsulate !== true)
  Reflect.set(fn, Symbol.for('fastify.display-name'), options.name)
  Reflect.set(fn, Symbol.for('plugin-meta'), options)

  // Faux modules support
  if (!('default' in fn)) {
    Reflect.set(fn, 'default', fn)
  }

  // TypeScript support for named imports
  // See https://github.com/fastify/fastify/issues/2404 for more details
  // The type definitions would have to be update to match this.
  const camelCase = toCamelCase(options.name)
  if (!autoName && Reflect.get(fn, camelCase) === undefined) {
    Reflect.set(fn, camelCase, fn)
  }

  return fn as typeof fn & { default: typeof fn }
}

module.exports = plugin
module.exports.default = plugin
module.exports.fastifyPlugin = plugin
