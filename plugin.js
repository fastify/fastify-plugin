'use strict'

const semver = require('semver')
const console = require('console')
const extractPluginName = require('./stackParser')
const { join, dirname } = require('path')

let count = 0

function plugin (fn, options = {}) {
  let autoName = false

  if (typeof fn.default !== 'undefined') { // Support for 'export default' behaviour in transpiled ECMAScript module
    fn = fn.default
  }

  if (typeof fn !== 'function') {
    throw new TypeError(`fastify-plugin expects a function, instead got a '${typeof fn}'`)
  }

  fn[Symbol.for('skip-override')] = true

  const pluginName = (options && options.name) || checkName(fn)

  if (typeof options === 'string') {
    checkVersion(options, pluginName)
    options = {}
  }

  if (typeof options !== 'object' || Array.isArray(options) || options === null) {
    throw new TypeError('The options object should be an object')
  }

  if (!options.name) {
    autoName = true
    options.name = pluginName + '-auto-' + count++
  }

  fn[Symbol.for('fastify.display-name')] = options.name

  if (options.fastify) {
    checkVersion(options.fastify, pluginName)
  }

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

function checkVersion (version, pluginName) {
  if (typeof version !== 'string') {
    throw new TypeError(`fastify-plugin expects a version string, instead got '${typeof version}'`)
  }

  // TODO refactor this check and move it inside Fastify itself.
  var fastifyVersion
  try {
    var pkgPath
    if (require.main.filename) {
      // We need to dynamically compute this to support yarn pnp
      pkgPath = join(dirname(require.resolve('fastify', { paths: [require.main.filename] })), 'package.json')
    } else {
      // In bundlers, there is no require.main.filename so we go ahead and require directly
      pkgPath = 'fastify/package.json'
    }

    fastifyVersion = semver.coerce(require(pkgPath).version)
  } catch (_) {
    console.info('fastify not found, proceeding anyway')
  }

  if (fastifyVersion && !semver.satisfies(fastifyVersion, version)) {
    throw new Error(`fastify-plugin: ${pluginName} - expected '${version}' fastify version, '${fastifyVersion}' is installed`)
  }
}

module.exports = plugin
