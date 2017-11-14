'use strict'

const semver = require('semver')
const console = require('console')

function plugin (fn, options) {
  if (typeof fn !== 'function') {
    throw new TypeError(`fastify-plugin expects a function, instead got a '${typeof fn}'`)
  }

  fn[Symbol.for('skip-override')] = true

  if (!options) return fn

  if (typeof options === 'string') {
    checkVersion(options)
  } else {
    if (options.version) {
      checkVersion(options.version)
      delete options.version
    }
    fn[Symbol.for('plugin-meta')] = options
  }

  return fn
}

function checkVersion (version) {
  if (typeof version !== 'string') {
    throw new TypeError(`fastify-plugin expects a version string, instead got '${typeof version}'`)
  }

  var fastifyVersion
  try {
    fastifyVersion = require('fastify/package.json').version
  } catch (_) {
    console.info('fastify not found, proceeding anyway')
  }

  if (fastifyVersion && !semver.satisfies(fastifyVersion, version)) {
    throw new Error(`fastify-plugin - expected '${version}' fastify version, '${fastifyVersion}' is installed`)
  }
}

module.exports = plugin
