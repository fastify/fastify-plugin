'use strict'

const semver = require('semver')
const console = require('console')

function plugin (fn, options) {
  if (typeof fn !== 'function') {
    throw new TypeError(`fastify-plugin expects a function, instead got a '${typeof fn}'`)
  }

  fn[Symbol.for('skip-override')] = true

  if (options === undefined) return fn

  if (typeof options === 'string') {
    checkVersion(options)
    return fn
  }

  if (typeof options !== 'object' || Array.isArray(options) || options === null) {
    throw new TypeError('The options object should be an object')
  }

  if (options.fastify) {
    checkVersion(options.fastify)
    delete options.fastify
  }

  fn[Symbol.for('plugin-meta')] = options

  return fn
}

function checkVersion (version) {
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
    throw new Error(`fastify-plugin - expected '${version}' fastify version, '${fastifyVersion}' is installed`)
  }
}

module.exports = plugin
