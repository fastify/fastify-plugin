'use strict'

const semver = require('semver')
const console = require('console')

function plugin (fn, version) {
  if (typeof fn !== 'function') {
    throw new TypeError(`fastify-plugin expects a function, instead got a '${typeof fn}'`)
  }

  if (version) {
    if (typeof version !== 'string') {
      throw new TypeError(`fastify-plugin expects a version string as second parameter, instead got '${typeof version}'`)
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

  fn[Symbol.for('skip-override')] = true
  return fn
}

module.exports = plugin
