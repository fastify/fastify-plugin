'use strict'

const extractPluginName = require('./stackParser')

let count = 0

function plugin (fn, options = {}) {
  let autoName = false

  if (typeof fn.default !== 'undefined') {
    // Support for 'export default' behaviour in transpiled ECMAScript module
    fn = fn.default
  }

  if (typeof fn !== 'function') {
    throw new TypeError(
      `fastify-plugin expects a function, instead got a '${typeof fn}'`
    )
  }

  fn[Symbol.for('skip-override')] = true

  const pluginName = (options && options.name) || checkName(fn)

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

  if (!options.name) {
    autoName = true
    options.name = pluginName + '-auto-' + count++
  }

  fn[Symbol.for('fastify.display-name')] = options.name
  fn[Symbol.for('plugin-meta')] = options

  // Faux modules support
  if (!fn.default) {
    fn.default = fn
  }

  // TypeScript support for named imports
  // See https://github.com/fastify/fastify/issues/2404 for more details
  // The type definitions would have to be update to match this.
  const camelCase = toCamelCase(options.name)
  if (!autoName && !fn[camelCase]) {
    fn[camelCase] = fn
  }

  return fn
}

function checkName (fn) {
  if (fn.name.length > 0) return fn.name

  try {
    throw new Error('anonymous function')
  } catch (e) {
    return extractPluginName(e.stack)
  }
}

function toCamelCase (name) {
  const newName = name.replace(/-(.)/g, function (match, g1) {
    return g1.toUpperCase()
  })
  return newName
}

plugin.default = plugin
module.exports = plugin
