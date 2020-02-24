'use strict'

const semver = require('semver')
const console = require('console')
const extractPluginName = require('./stackParser')

function plugin (fn, options = {}) {
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
    options.name = pluginName
  }

  fn[Symbol.for('fastify.display-name')] = options.name

  if (options.fastify) {
    checkVersion(options.fastify, pluginName)
  }

  fn[Symbol.for('plugin-meta')] = options

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

function checkVersion (version, pluginName) {
  if (typeof version !== 'string') {
    throw new TypeError(`fastify-plugin expects a version string, instead got '${typeof version}'`)
  }

  var fastifyVersion
  try {
    fastifyVersion = require('fastify/package.json').version.replace(/-rc\.\d+/, '')
  } catch (_) {
    console.info('fastify not found, proceeding anyway')
  }

  if (fastifyVersion && !semver.satisfies(fastifyVersion, version)) {
    throw new Error(`fastify-plugin: ${pluginName} - expected '${version}' fastify version, '${fastifyVersion}' is installed`)
  }
}

module.exports = plugin
