'use strict'

const symbols = require('./lib/symbols')
const prepareMetadata = require('./lib/prepareMetadata')
const getPluginName = require('./lib/getPluginName')
const toCamelCase = require('./lib/toCamelCase')

let count = 0

/**
 * @param { import('./types/index').FastifyPluginFunction } fn
 * @param { import('./types/index').PluginMetadata | string } metadata
 * @returns { import('./types/index').FastifyPluginFunction }
 */
function plugin (fn, metadata = {}) {
  let pluginMetadata = prepareMetadata(metadata)

  if (fn?.default !== undefined) {
    fn = fn.default
  }
  if (typeof fn !== 'function') {
    throw new TypeError(`fastify-plugin expects a function, instead got a '${typeof fn}'`)
  }

  let autoName = false
  if (!pluginMetadata.name) {
    autoName = true
    pluginMetadata = { ...pluginMetadata, name: getPluginName(fn) + '-auto-' + count++ }
  }

  fn[symbols.kSkipOverride] = pluginMetadata.encapsulate !== true
  fn[symbols.kDisplayName] = pluginMetadata.name
  fn[symbols.kPluginMeta] = pluginMetadata

  if (!fn.default) {
    fn.default = fn
  }

  const camelCase = toCamelCase(pluginMetadata.name)
  if (!autoName && !fn[camelCase]) {
    fn[camelCase] = fn
  }
  return fn
}

module.exports = plugin
module.exports.default = plugin
module.exports.fastifyPlugin = plugin
module.exports.symbols = symbols
